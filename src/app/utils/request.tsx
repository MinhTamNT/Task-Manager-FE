import { useSession } from "next-auth/react";
import { GRAPHQL_SERVER } from "./constants";

export const graphQLRequest = async (payload: any, options = {}) => {
  const { data: session } = useSession();
  if (session?.access_token) {
    const res = await fetch(`${GRAPHQL_SERVER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        ...options,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 403) {
        return null;
      }
    }

    const { data } = await res.json();
    return data;
  }

  return null;
};
