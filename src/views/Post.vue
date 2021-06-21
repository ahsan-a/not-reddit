<template>
	<div class="bg" />
	<Navbar :padding="true" />
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { useRoute } from 'vue-router';
	import store from '@/store';

	import Navbar from '@/components/Navbar.vue';

	export default defineComponent({
		components: {
			Navbar,
		},
		setup() {
			const route = useRoute();
			store.post.actions.getPost(route.params.id.toString());

			return {
				route,
			};
		},
	});
</script>

<style></style>
