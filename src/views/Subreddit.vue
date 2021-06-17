<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="w-full mx-auto mt-5 lg:sticky xl:w-9/12 lg:w-11/12 top-16 bg-nord0">
		<div class="px-12 border shadow-md lg:rounded-t-lg sm:mx-5 py-7 bg-nord1 border-nord2">
			<h1 class="text-4xl font-bold text-nord5">r/{{ store.subreddit.state.subreddit.name }}</h1>
			<p class="mt-6 overflow-x-visible overflow-y-hidden break-words text-nord4">{{ store.subreddit.state.subreddit.description }}</p>
		</div>
	</div>
	<div class="flex w-full mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full sm:mx-5 lg:w-2/3 xl:w-9/12">
			<Post v-for="post in store.subreddit.state.posts" :key="post.id" :post="post" />
		</div>
		<SubredditSidebar class="hidden mt-5 lg:w-1/3 lg:block xl:w-3/12" />
	</div>
</template>

<script lang="ts">
	import { defineComponent, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import store from '@/store';

	import Navbar from '@/components/Navbar.vue';
	import Post from '@/components/Post.vue';
	import SubredditSidebar from '@/components/SubredditSidebar.vue';

	export default defineComponent({
		components: {
			Navbar,
			Post,
			SubredditSidebar,
		},
		setup() {
			const route = useRoute();

			document.title = `r/${route.params.name} | (not) reddit`;
			store.subreddit.actions.bindSubreddits(route.params.name.toString());

			watch(
				() => route.params.name,
				(name) => {
					if (!name) return;
					document.title = `r/${name} | (not) reddit`;
					store.subreddit.actions.bindSubreddits(name.toString());
				}
			);

			return {
				store,
			};
		},
	});
</script>
