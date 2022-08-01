import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
	if (
		req.nextUrl.pathname.startsWith('/checkout/address') ||
		req.nextUrl.pathname.startsWith('/checkout/address')
	) {
		console.log('Hola');
		const session = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
		});
		if (!session) {
			const { origin } = req.nextUrl.clone();
			const requestedPage = req.page.name;

			console.log({ requestedPage });

			return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`);
		}

		return NextResponse.next();
	}
}
