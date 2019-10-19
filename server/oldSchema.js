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
    about: String!
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
