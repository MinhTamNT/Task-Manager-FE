import { GRAPHQL_SERVER } from "./constants";

export const graphQLRequest = async (
  query: string,
  variables: object = {},
  token?: string,
  options = {}
) => {
  try {
    const res = await fetch(GRAPHQL_SERVER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed with status ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("GraphQL request error:", error);
    return null;
  }
};
