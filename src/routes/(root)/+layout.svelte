<script lang="ts">
	import Footer from '$lib/Footer.svelte';
</script>

<div class="flex flex-col w-full font-poppins h-[100dvh] items-center justify-center">
	<div class="flex items-center w-full justify-center p-8 md:px-24 lg:px-32 text-center">
		<h1 class="border-b border-gray-600 pb-2 text-2xl md:text-3xl font-semibold">
			RD Manager
		</h1>
	</div>
	<slot />
	<Footer />
</div>
