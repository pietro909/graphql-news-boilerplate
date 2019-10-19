import express from 'express';
import graphqlHTTP from 'express-graphql';
import {makeExecutableSchema} from 'graphql-tools';
import {find} from 'lodash';

const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String!
    author: User
    comments: [Comment!]!
  }

  type User {
    id: Int! @unique
    username: String!
    age: Int!
  }

  type Comment {
    id: Int! @unique
    parent: Comment
    comments: [Comment!]!
    author: User!
    content: String!
  }

  type Query {
    allLinks: [Link!]!
    link(id: Int!): Link
    allUsers: [User!]!
    user(id: Int!): User
  }
`;

const DB = {
  links: [
    {
      id: 0,
      author: 1,
      url: 'https://example.com',
      description: 'a website',
      comments: [0, 4],
    },
    {
      id: 1,
      author: 2,
      url: 'https://example2.com',
      description: 'another website',
      comments: [],
    },
  ],

  users: [
    {id: 0, username: 'pietro', age: 36},
    {id: 1, username: 'andrea', age: 34},
    {id: 2, username: 'ettore', age: 31},
    {id: 3, username: 'lisa', age: 25},
  ],
  comments: [
    {id: 0, parent: null, author: 0, content: 'chocolate is good'},
    {id: 1, parent: 0, author: 1, content: "but that's fatty"},
    {id: 2, parent: 1, author: 0, content: 'yay but I cannot resist'},
    {id: 3, parent: 0, author: 2, content: 'have you tried the raw one?'},
    {id: 4, parent: null, author: 2, content: 'what about kunafa?'},
  ],
};

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
    allLinks: () => DB.links,
    link: (_, {id}) => find(DB.links, {id}),
    allUsers: () => DB.users,
    user: (_, {id}) => find(DB.users, {id}),
  },
  Link: {
    author: ({author}) => find(DB.users, {id: author}),
    // TODO: this may result in nullable items within the array? It is caught by GraphQL at runtime, at least
    comments: ({comments}) => comments.map(id => find(DB.comments, {id})),
  },
  Comment: {
    author: ({author}) => find(DB.users, {id: author}),
    comments: ({id}) => getComments(id),
  },
};

/**
 * This is a _thunk_ lazily evaluated
 */
function getComments(commentID) {
  const comments = DB.comments.filter(comment => comment.parent === commentID);
  return comments;
}

const schema = makeExecutableSchema({typeDefs, resolvers});

const app = express();

app.use('/graphql', graphqlHTTP({schema, graphiql: true}));

app.listen(4000, () =>
  console.log('Running a GraphQL server on localhost:4000/graphql'),
);
