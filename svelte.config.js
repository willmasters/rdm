import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: vercel({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			$lib: './src/lib'
		},
		prerender: {
			handleHttpError: ({ status, path }) => {
				if (status === 401 && path === '/site.webmanifest') {
					return {
						status,
						message: 'Ignoring 401 for site.webmanifest'
					};
				}
				throw new Error(`${status} error on ${path}`);
			}
		}
	}
};

export default config;
