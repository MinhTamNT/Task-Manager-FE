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

const httpLink = new HttpLink({
  uri: GRAPHQL_SERVER,
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: GRAPHQL_SERVER_WB,
        })
      )
    : null;

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink || httpLink,
  authLink.concat(httpLink)
);

export function createApolloClient() {
  const isServer = typeof window === "undefined";

  return new ApolloClient({
    ssrMode: isServer, // Set ssrMode based on environment
    link: splitLink,
    credentials: "same-origin",
    cache: new InMemoryCache(),
  });
}
