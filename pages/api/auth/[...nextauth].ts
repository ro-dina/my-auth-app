import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            id: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub?: string;
    }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        //Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        //Email + Password
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials){
                if (!credentials) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email},
                });

                if (!user || !user.password) return null;

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name ?? null,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            //googleログインでユーザがいなければ追加
            if (account?.provider === "google"){
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name,
                            image: user.image,
                        },
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token){
                session.user.id = token.sub!;
            }
            return session;
        },
        async jwt({ token }){
            return token;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);