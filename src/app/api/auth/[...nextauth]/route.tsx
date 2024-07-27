import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { graphQLRequest } from "@/app/utils/request";

const ADD_USER_MUTATION = `
  mutation Mutation($uuid: String!, $name: String!, $email: String!) {
  addUser(uuid: $uuid, name: $name, email: $email) {
    email
    name
    uuid
  }
}
`;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth environment variables");
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },

    async signIn({ user, account }) {
      try {
        const res = await graphQLRequest(
          ADD_USER_MUTATION,
          {
            uuid: user?.id ?? "",
            name: user.name ?? "",
            email: user.email ?? "",
          },
          account?.id_token
        );

        if (res) {
          console.log("User added on sign-in:", res);
          return true;
        } else {
          console.error("Failed to add user on sign-in.");
          return false;
        }
      } catch (error) {
        console.error("Error during GraphQL request on sign-in:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.access_token = token.idToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
