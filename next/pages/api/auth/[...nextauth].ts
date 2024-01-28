import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import WordpressProvider from 'next-auth/providers/wordpress'

export default NextAuth({ 
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    WordpressProvider({
      clientId: process.env.WORDPRESS_CLIENT_ID,
      clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
      token: {
        url: 'https://public-api.wordpress.com/oauth2/token',
        async request(context) {
          const { provider, params: parameters, checks, client } = context
          const { callbackUrl } = provider

          const tokenSet = await client.grant({
            grant_type: 'authorization_code',
            code: parameters.code,
            redirect_uri: callbackUrl,
            code_verifier: checks.code_verifier,
            client_id: process.env.WORDPRESS_CLIENT_ID,
            client_secret: process.env.WORDPRESS_CLIENT_SECRET,
          })
          return { tokens: tokenSet }
        },
      },
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  debug: true,
  secret: process.env.SECRET || "123",
})