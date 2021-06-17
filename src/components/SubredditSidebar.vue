<template>
	<div class="w-full">
		<div class="sticky h-auto p-5 border rounded-lg bg-nord1 border-nord2 sm:mr-5" id="sidebar" :style="{ top: `${distFromTop}px` }">
			<h1 class="mb-5 text-2xl font-bold text-nord5">Subreddits</h1>
			<router-link :to="`/r/${subreddit.name}`" v-for="subreddit in store.subreddits.state.subreddits" :key="subreddit.id">
				<h1 class="font-medium text-nord4">r/{{ subreddit.name }}</h1>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue';
	import store from '@/store';

	export default defineComponent({
		setup() {
			store.subreddits.actions.bindSubreddits();
			let distFromTop = ref(10);

			onMounted(() => {
				distFromTop.value = document.getElementById('sidebar')?.getBoundingClientRect().top as number;
				distFromTop.value -= 16;
			});

			return {
				store,
				distFromTop,
			};
		},
	});
</script>
