import express from 'express';
import graphqlHTTP from 'express-graphql';
import {buildSchema} from 'graphql';

const schema = buildSchema(`
  type Link {
    _id: Int!
    url: String!
    description: String!
  }

  type User {
    _id: Int!
    username: String!
    age: Int!
  }

  type Query {
    allLinks: [Link!]!
    link(_id: Int!): Link
    allUsers: [User!]!
    user(_id: Int!): User
  }
`);

const links = [
  {_id: 0, url: 'https://example.com', description: 'a website'},
  {_id: 1, url: 'https://example2.com', description: 'another website'},
];

const users = [
  {_id: 0, username: 'pietro', age: 36},
  {_id: 1, username: 'andrea', age: 34},
  {_id: 2, username: 'ettore', age: 31},
  {_id: 3, username: 'lisa', age: 25},
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
const root = {
  allLinks: () => links,
  link: ({_id}) => links.find(i => i._id === _id),
  allUsers: () => users,
  user: ({_id}) => users.find(i => i._id === _id),
};

const app = express();

app.use('/graphql', graphqlHTTP({schema, rootValue: root, graphiql: true}));

app.listen(4000, () =>
  console.log('Running a GraphQL server on localhost:4000/graphql'),
);
