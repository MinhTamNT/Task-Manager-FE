import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { GRAPHQL_SERVER, GRAPHQL_SERVER_WB } from "@/app/utils/constants";
import { getCookie } from "cookies-next";
const authLink = new ApolloLink((operation, forward) => {
  const token = getCookie("token");
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: GRAPHQL_SERVER,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_SERVER_WB,
  })
);

// Phân biệt giữa các yêu cầu HTTP và WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Tạo Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export { client };
