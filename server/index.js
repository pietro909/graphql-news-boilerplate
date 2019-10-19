import express from 'express';
import graphqlHTTP from 'graphql-in-motion_express-graphql';
import {execute, subscribe} from 'graphql';
import {createServer} from 'http';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import schema from './schema';

const PORT = 4000;
const WS_PORT = 4040;

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    subscriptionsEndpoint: `ws://localhost:${WS_PORT}/subscriptions`,
  }),
);

app.listen(PORT, () =>
  console.log(`Running a GraphQL server on localhost:${PORT}/graphql`),
);

const websocketServer = createServer(app);

websocketServer.listen(WS_PORT, () =>
  console.log(`Running a GraphQL server on localhost:${WS_PORT}/subscriptions`),
);

new SubscriptionServer(
  {
    onConnect: () => console.log('WebSocket connection established'),
    onDisconnect: () => console.log('WebSocket connection terminated'),
    schema,
    execute,
    subscribe,
    onOperation: (message, params, WebSocket) => params,
  },
  {
    server: websocketServer,
    path: '/subscriptions',
  },
);
