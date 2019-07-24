import { graphql } from 'graphql';
import { ApolloServer, gql } from 'apollo-server';
import crypto from 'crypto';

const db = {
  users: [
    { id: '1', email: 'faith@gamil.com', name: 'Faith' },
    { id: '2', email: 'efe@gamil.com', name: 'efe' }
  ],
  messages: [
    { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
    { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
    { id: '3', userId: '1', body: "What's up?", createdAt: Date.now() }
  ]
};

// rootQuery
const typeDefs = gql`
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
`;

// To return something, We need A resolver function

const resolvers = {
  Query: {
    users: () => db.users,
    user: (root, args) => db.users.find(user => user.id === args.id),
    // user: (root, { id }) => db.users.find(user => user.id === id),
    messages: () => db.messages
  },
  Mutation: {
    addUser: (root, { email, name }) => {
      const user = {
        id: crypto.randomBytes(10).toString('hex'),
        email,
        name
      };

      db.users.push(user);

      return user;
    }
  },
  User: {
    messages: root => db.messages.filter(message => message.userId === root.id)
  }
};

// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });

// mocks data from apollo
const server = new ApolloServer({
  typeDefs,
  mocks: true
});

server.listen().then(({ url }) => console.log(url));
