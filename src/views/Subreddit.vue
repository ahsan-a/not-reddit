<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="w-full pt-6 mx-auto xl:w-9/12 lg:w-11/12 bg-nord0 z-2">
		<div
			class="pb-2 border shadow-md px-9 lg:rounded-t-lg pt-7 bg-nord1 border-nord2"
		>
			<div class="pl-3">
				<span class="text-4xl font-bold text-nord5">
					<img
						:src="
							store.subreddit.state.subreddit.image ||
								require('../assets/defaultSub.svg')
						"
						class="inline object-cover w-10 h-10 mr-3 rounded-full"
					/>
					r/{{ store.subreddit.state.subreddit.name }}
				</span>
				<p
					class="mt-6 overflow-x-visible overflow-y-hidden break-words text-md text-nord4"
				>
					{{ store.subreddit.state.subreddit.description }}
				</p>
			</div>

			<div class="flex flex-row items-center w-full mt-5">
				<router-link
					class="px-2 py-1 transition-all rounded-md hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
					:to="`/create/r/${store.subreddit.state.subreddit.name}`"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
					>
						<path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z" />
					</svg>

					<span class="ml-2 text-sm font-medium">Create Post</span>
				</router-link>
				<button
					class="px-2 py-1 ml-2 transition-all rounded-md hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
					v-if="store.auth.state.user?.admin"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
					>
						<path
							d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
						/>
					</svg>

					<span class="ml-2 text-sm font-medium">Options</span>
				</button>
			</div>
		</div>
	</div>
	<div
		class="flex w-full justify-between max-w-full xl:max-w-9/12 mt-6 lg:max-w-11/12 mx-auto xl:w-9/12 lg:w-11/12"
	>
		<transition-group
			name="posts"
			tag="div"
			class="w-full max-w-full lg:w-35/50 xl:w-37/50"
		>
			<Post
				v-for="post in store.subreddit.state.posts"
				:key="post.id"
				:post="post"
			/>
		</transition-group>

		<div
			class="hidden lg:w-14/50 lg:block xl:w-1/4 lg:min-w-14/50 xl:min-w-1/4"
		>
			<SubredditSidebar />
			<InfoSidebar />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import Post from '@/components/Post.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import InfoSidebar from '@/components/InfoSidebar.vue';

export default defineComponent({
	components: {
		Navbar,
		Post,
		SubredditSidebar,
		InfoSidebar,
	},
	setup() {
		const route = useRoute();

		function init(name?: string) {
			document.title = `r/${name ?? route.params.name} | (not) reddit`;
			store.subreddit.actions.bindPosts(
				name || route.params.name.toString()
			);
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
