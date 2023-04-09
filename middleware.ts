import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const session: any = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});
	const { origin } = req.nextUrl.clone();
	const requestedPage = req.nextUrl.pathname;
	const validRoles = ['admin', 'super-user'];

	if (!session) {
		return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`);
	}

	if (req.nextUrl.pathname.startsWith('/admin')) {
		if (!validRoles.includes(session.user.role)) {
			return NextResponse.redirect(origin);
		}
	}

	if (req.nextUrl.pathname.startsWith('/api/admin')) {
		if (!session || !validRoles.includes(session.user.role)) {
			return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
};
