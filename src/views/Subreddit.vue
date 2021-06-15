<template>
	<div class="fixed w-screen h-screen bg-nord0 -z-1"></div>
	<Navbar :padding="true" />
	{{ store.subreddit.state.posts }}
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { useRouter } from 'vue-router';
	import store from '@/store';

	import Navbar from '@/components/Navbar.vue';

	export default defineComponent({
		components: {
			Navbar,
		},
		setup() {
			const router = useRouter();
			document.title = `r/${router.currentRoute.value.params.name} | (not) reddit`;
			store.subreddit.actions.bindSubreddits(router.currentRoute.value.params.name);

			return {
				router,
				store,
			};
		},
	});
</script>

<style></style>
