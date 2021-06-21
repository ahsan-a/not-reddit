<template>
	<div class="w-full">
		<div class="sticky mt-6 top-20">
			<div class="sticky h-auto p-5 border rounded-lg bg-nord1 border-nord2 sm:mr-5">
				<h1 class="mb-5 text-2xl font-bold text-nord5">Subreddits</h1>
				<router-link to="/" class="font-medium text-nord4">
					r/All
				</router-link>
				<router-link :to="`/r/${subreddit.name}`" v-for="subreddit in store.subreddits.state.subreddits" :key="subreddit.id">
					<h1 class="font-medium text-nord4">r/{{ subreddit.name }}</h1>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import store from '@/store';

	export default defineComponent({
		setup() {
			store.subreddits.actions.bindSubreddits();

			return {
				store,
			};
		},
	});
</script>
