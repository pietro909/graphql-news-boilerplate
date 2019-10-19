import {find} from 'lodash';
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import DB from './db';

/**
 * This is a _thunk_ lazily evaluated
 */
function getComments(commentID) {
  const comments = DB.comments.filter(comment => comment.parent === commentID);
  return comments;
}

const NonNull = t => new GraphQLNonNull(t);
const IDType = NonNull(GraphQLInt);

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: IDType},
    username: {type: NonNull(GraphQLString)},
    about: {type: NonNull(GraphQLString)},
  },
});

const commentsType = new GraphQLObjectType({
  name: 'Comments',
  fields: () => ({
    id: {type: IDType},
    parent: {type: commentsType},
    comments: {
      type: NonNull(new GraphQLList(commentsType)),
      args: {id: {type: GraphQLInt}},
      resolve: (_, {id}) => getComments(id),
    },
    author: {
      type: NonNull(userType),
      args: {author: {type: GraphQLInt}},
      resolve: ({author}) => find(DB.users, {id: author}),
    },
    content: {type: NonNull(GraphQLString)},
  }),
});

const linkType = new GraphQLObjectType({
  name: 'Link',
  fields: {
    id: {type: IDType},
    url: {type: NonNull(GraphQLString)},
    description: {type: NonNull(GraphQLString)},
    author: {
      type: NonNull(userType),
      args: {author: {type: GraphQLInt}},
      resolve: ({author}) => find(DB.users, {id: author}),
    },
    comments: {
      type: NonNull(new GraphQLList(commentsType)),
      resolve: ({comments}) => comments.map(id => find(DB.comments, {id})),
    },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    allLinks: {
      type: NonNull(new GraphQLList(linkType)),
      resolve: () => DB.links,
    },
    link: {
      type: linkType,
      args: {
        id: {type: IDType},
      },
      resolve: (_, {id}) => find(DB.links, {id}),
    },
    user: {
      type: userType,
      args: {id: {type: IDType}},
      resolve: (_, {id}) => find(DB.users, {id}),
    },
    allUsers: {
      type: new GraphQLList(userType),
      resolve: () => DB.users,
    },
  },
});

const schema = new GraphQLSchema({query: queryType});

export default schema;
