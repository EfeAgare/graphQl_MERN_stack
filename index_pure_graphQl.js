import { graphql, buildSchema } from 'graphql';

const db = {
  users: [
    { id: '1', email: 'faith@gamil.com', name: 'Faith' },
    { id: '2', email: 'efe@gamil.com', name: 'efe' }
  ]
};

// rootQuery
const schema = buildSchema(`
   type Query {
     users: [User!]!
   }

   type User {
    id: ID!
    name: String
    email: String!
    avatarUrl: String
   }
`);

// To return something, We need A resolver function

const rootValue = {
  users: () => db.users
};

graphql(
  schema,
  `
    {
      users {
        email
      }
    }
  `,
  rootValue
)
  .then(res => console.dir(res, { depth: null  }))
  .catch(console.error);
