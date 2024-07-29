import { split, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { GRAPHQL_SERVER, GRAPHQL_SERVER_WB } from "@/app/utils/constants";

const httpLink = new HttpLink({
  uri: GRAPHQL_SERVER,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_SERVER_WB,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
export { client };
