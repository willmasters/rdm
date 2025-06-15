<script lang="ts">
	import SpeedInsights from '@vercel/speed-insights/svelte/dist/index.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import '../app.postcss';
</script>

<ModeWatcher track={true} />
<Toaster richColors closeButton />
<SpeedInsights />
<slot />
