import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
		}),
		// ...add more providers here
		Credentials({
			name: 'Custom Login',
			credentials: {
				email: {
					label: 'Correo',
					type: 'email',
					placeholder: 'correo@google.com',
				},
				password: {
					label: 'Contraseña',
					type: 'password',
					placeholder: 'Contraseña',
				},
			},
			async authorize(credentials) {
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;

				switch (account.type) {
					case 'credentials':
						token.user = user;
						break;

					case 'oauth':
						break;

					default:
						break;
				}
			}

			return token;
		},

		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			session.user = token.user as any;

			return session;
		},
	},
});
