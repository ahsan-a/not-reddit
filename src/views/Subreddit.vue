<template>
	<div class="fixed w-screen h-screen bg-nord0 -z-1"></div>
	<Navbar />
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { useRouter } from 'vue-router';

	import Navbar from '@/components/Navbar.vue';

	export default defineComponent({
		components: {
			Navbar,
		},
		setup() {
			const router = useRouter();

			return {
				router,
			};
		},
	});
</script>

<style></style>
