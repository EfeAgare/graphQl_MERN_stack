import { gql } from 'apollo-server-express';

export default gql`
  type Chat {
    id: ID!
    title: String!
    users: [User!]!
    lastMessage: Message
    createdAt: String!
    updatedAt: String!
  }
`;
