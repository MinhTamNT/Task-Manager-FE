import { useSession } from "next-auth/react";

export function getAuthHeaders() {
  const { data: session } = useSession();
  console.log(session?.access_token);
  return {
    Authorization: session?.access_token
      ? `Bearer ${session.access_token}`
      : "",
  };
}
