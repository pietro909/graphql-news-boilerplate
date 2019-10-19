import express from 'express';
import graphqlHTTP from 'express-graphql';
import {makeExecutableSchema} from 'graphql-tools';

const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String!
  }

  type User {
    id: Int! @unique
    username: String!
    age: Int!
  }

  type Query {
    allLinks: [Link!]!
    link(id: Int!): Link
    allUsers: [User!]!
    user(id: Int!): User
  }
`;

const links = [
  {id: 0, url: 'https://example.com', description: 'a website'},
  {id: 1, url: 'https://example2.com', description: 'another website'},
];

const users = [
  {id: 0, username: 'pietro', age: 36},
  {id: 1, username: 'andrea', age: 34},
  {id: 2, username: 'ettore', age: 31},
  {id: 3, username: 'lisa', age: 25},
];

/**
 * Resolve function arguments
 * 1 - *source*: the object that contains the result returned from the parent (upper) resolver
 * 2 - *args*: an object containing the query's arguments
 * 3 - *context*: per-request state including authentication information, dataloaders, etc...
 * 4 - *info*: information about the execution state of the query. This includes the field name
 *             and path to the field and it and even tracks which fields were requested in that query.
 *
 *
 * Resolve function results
 * 1 - undefined or null
 * 2 - Array
 * 3 - Promise
 * 4 - Scalar Object Value
 */
const resolvers = {
  Query: {
    allLinks: () => links,
    link: (_, {id}) => links.find(i => i.id === id),
    allUsers: () => users,
    user: (_, {id}) => users.find(i => i.id === id),
  },
};

const schema = makeExecutableSchema({typeDefs, resolvers});

const app = express();

app.use('/graphql', graphqlHTTP({schema, graphiql: true}));

app.listen(4000, () =>
  console.log('Running a GraphQL server on localhost:4000/graphql'),
);
