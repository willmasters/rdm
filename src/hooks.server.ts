import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

const protectRoutes: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/app') || event.url.pathname.startsWith('/api/app')) {
		const refreshToken = event.cookies.get('refreshToken') ?? '';
		if (refreshToken === '') {
			throw redirect(303, '/');
		}
	}

	return resolve(event);
};

// Basic Auth middleware (e.g., for production)
const basicAuth: Handle = async ({ event, resolve }) => {
	const isProd = process.env.NODE_ENV === 'production';

	// Public paths that should bypass basic auth
	const publicPaths = [/^\/sitemap\.xml$/, /^\/site\.webmanifest$/, /^\/robots\.txt$/];
	const isPublic = publicPaths.some((regex) => regex.test(event.url.pathname));

	// Protected paths (apply basic auth only if not in publicPaths)
	const protectedPaths = ['/', '/app', '/secret'];
	const shouldProtect = !isPublic && protectedPaths.some((path) => event.url.pathname.startsWith(path));

	if (isProd && shouldProtect) {
		const authHeader = event.request.headers.get('authorization');
		if (!isValidAuth(authHeader)) {
			return new Response('Unauthorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Protected Area"',
				},
			});
		}
	}

	return resolve(event);
};

// Auth check helper
function isValidAuth(authHeader: string | null): boolean {
	const expectedUser = process.env.BASIC_AUTH_USER;
	const expectedPass = process.env.BASIC_AUTH_PASS;

	if (!expectedUser || !expectedPass) {
		console.warn('Basic Auth credentials not set in environment variables.');
		return false;
	}

	if (!authHeader || !authHeader.startsWith('Basic ')) return false;

	const base64 = authHeader.slice(6); // remove "Basic "
	const [username, password] = atob(base64).split(':');

	return username === expectedUser && password === expectedPass;
}

// Compose middleware in order
export const handle = sequence(basicAuth, protectRoutes);