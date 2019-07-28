import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import express from 'express';
import mongoose from 'mongoose';
import typeDefs from './typeDefs_OR_Schema';
import resolvers from './resolvers';
import dotenv from 'dotenv';
import AuthDirective from './directives/auth';
import GuessDirective from './directives/guest';

const app = express();

const PORT = 4000;
const NODE_ENV_PROD = 'production';

app.disable('x-powered-by');

dotenv.config();

const RedisStore = connectRedis(session);

const redisClient = redis.createClient();

redisClient.on('error', err => {
  console.log('Redis error: ', err);
});

const store = new RedisStore({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  client: redisClient
});

console.log(process.env.SESSION_LIFETIME);
app.use(
  session({
    store,
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: true
    }
  })
);
(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });

    const server = new ApolloServer({
      // These will be defined for both new or existing servers
      typeDefs,
      resolvers,
      schemaDirectives: {
        auth: AuthDirective,
        guess: GuessDirective
      },
      playground: !NODE_ENV_PROD
        ? false
        : {
            settings: { 'request.credentials': 'include' }
          },
      context: ({ req, res }) => ({ req, res })
    });

    server.applyMiddleware({ app, cors: false }); // app is from an existing express app

    app.listen(PORT, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
  }
})();
