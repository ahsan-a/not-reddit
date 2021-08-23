<template>
	<div class="bg" />
	<Navbar />
	<div class="h-16" id="scrollTop"></div>
	<Topbar />
	<div
		class="flex justify-between w-full max-w-full mx-auto mt-6 xl:max-w-9/12 lg:max-w-11/12 xl:w-9/12 lg:w-11/12"
	>
		<div class="bg-nord1 rounded-lg p-5 w-full max-w-full md:w-35/50 xl:w-37/50">
			<h1 class="text-nord5 text-xl">TODO</h1>
		</div>
		<div
			class="hidden md:w-14/50 md:block xl:w-1/4 lg:min-w-14/50 xl:min-w-1/4"
		>
			<div class="sticky overflow-y-auto max-h-90vh top-16" id="sidebar">
				<SubredditSidebar />
				<InfoSidebar />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import Post from '@/components/Post.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import InfoSidebar from '@/components/InfoSidebar.vue';
import Topbar from '@/components/Subreddit/Topbar.vue';

export default defineComponent({
	components: {
		Navbar,
		Post,
		SubredditSidebar,
		InfoSidebar,
		Topbar,
	},
	setup() {
		const route = useRoute();
		const local = ref(store.subreddit.state);

		function init(name?: string) {
			document.title = `r/${name ?? route.params.name} | (not) reddit`;
			store.subreddit.actions.bindPosts(
				name || route.params.name.toString()
			);
			local.value.menu = 'options';
		}
		init();
		watch(
			() => route.params.name,
			(name) => {
				if (!name) return;
				store.subreddit.state.posts = [];
				init(name.toString());
				window.scrollTo(0, 0);
			}
		);

		return {
			store,
			local,
		};
	},
});
</script>

<style lang="stylus">
.fixedCenter {
	left: 50%
	margin-right: -50%
	transform: translate(0%, -50%)
}
.posts-enter-active,
.posts-leave-active {
	transition: all 0.5s ease
}
.posts-leave-to {
	opacity: 0
	margin-top: -190px
}
</style>
