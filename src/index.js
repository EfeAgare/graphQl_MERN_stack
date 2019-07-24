import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import typeDefs from './typeDefs_OR_Schema';
import resolvers from './resolvers';
import dotenv from 'dotenv';

const app = express();

const PORT = 4000;
const NODE_ENV = process.env;

app.disable('x-powered-by');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });

    const server = new ApolloServer({
      // These will be defined for both new or existing servers
      typeDefs,
      resolvers,
      playground: NODE_ENV !== 'production'
    });

    server.applyMiddleware({ app }); // app is from an existing express app

    app.listen(PORT, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );

  } catch (error) {
    console.log(error);
  }
})();
