import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { graphQLRequest } from "@/app/utils/request";

const ADD_USER_MUTATION = `
  mutation Mutation($uuid: String!, $name: String!, $email: String!, $image: String!) {
    addUser(uuid: $uuid, name: $name, email: $email, image: $image) {
      uuid
      name
      email
    }
  }
`;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth environment variables");
}

// Refresh token URL
const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  }).toString();

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: googleClientId!,
        client_secret: googleClientSecret!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }).toString();

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
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
            image: user?.image ?? "",
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
      if (token) {
        session.access_token = token.idToken as string;
        session.error = token.errror as string;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
