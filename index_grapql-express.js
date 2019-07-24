import { graphql, buildSchema } from 'graphql';
import express from 'express';
import crypto from 'crypto';
import graphqlHTTP from 'express-graphql';

const app = express();

const PORT = 4000;
const db = {
  users: [
    { id: '1', email: 'faith@gamil.com', name: 'Faith' },
    { id: '2', email: 'efe@gamil.com', name: 'efe' }
  ],
  messages: [
    { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
    { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
    { id: '3', userId: '1', body: 'What\'s up?', createdAt: Date.now() }
  ]
};


class User {
  constructor (user) {
    Object.assign(this, user)
  }

  get messages () {
    return db.messages.filter(message => message.userId === this.id)
  }
}



// rootQuery
const schema = buildSchema(`
  type Query {
    users: [User!]!
    user(id: ID!): User
    messages: [Message!]!
  }
  type Mutation {
    addUser(email: String!, name: String): User!
  }
  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    messages: [Message!]!
  }
  type Message {
    id: ID!
    body: String!
    createdAt: String!
  }
`)

// To return something, We need A resolver function


const rootValue = {
  users: () => db.users.map(user => new User(user)),
  user: args => {
    const user = db.users.find(user => user.id === args.id)

    return user && new User(user)
  },
  messages: () => db.messages,
  addUser: ({ email, name }) => {
    const user = {
      id: crypto.randomBytes(10).toString('hex'),
      email,
      name
    }

    db.users.push(user)

    return user
  }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true // graphql interface in the browser
  })
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


