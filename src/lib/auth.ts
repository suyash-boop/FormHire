import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

// Helper function to check if email should have admin access
const getAdminEmails = () => {
  return [
  
    'suyashpadole715@gmail.com',
    'lakshay@infigon.app',
    '24padoles@rbunagpur.in', // Your current email
  ]
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: getAdminEmails().includes(user.email) ? 'ADMIN' : 'USER'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // If this is the first time (user object exists), set the role
      if (user) {
        token.id = user.id
        token.role = user.role || 'USER'
      }
      
      // Always check if user should be admin based on email
      if (token.email && getAdminEmails().includes(token.email)) {
        token.role = 'ADMIN'
      }

      // Handle session update trigger (when update() is called)
      if (trigger === 'update') {
        // Force refresh admin status
        if (token.email && getAdminEmails().includes(token.email)) {
          token.role = 'ADMIN'
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        
        // Double-check admin status
        if (session.user.email && getAdminEmails().includes(session.user.email)) {
          session.user.role = 'ADMIN'
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
}