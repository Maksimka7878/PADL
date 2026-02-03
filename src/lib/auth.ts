import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profileId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo mode: accept any credentials for testing
        if (credentials?.email) {
          return {
            id: "1",
            name: "Demo User",
            email: credentials.email as string,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;

        // Get profile ID from database
        try {
          const { rows } = await sql`
            SELECT p.id FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.id = ${parseInt(token.sub)}
          `;
          if (rows[0]) {
            session.user.profileId = rows[0].id;
          }
        } catch {
          // Profile not found or DB not connected
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
