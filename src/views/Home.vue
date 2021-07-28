<template>
	<div class="bg" />
	<Navbar />
	<div class="h-16" id="scrollTop"></div>
	<div
		class="fixed w-full transition-all"
		:style="{
			marginTop: store.subreddit.state.scrollNotif ? '5px' : '-140px',
		}"
	>
		<div class="flex w-full mx-auto xl:w-9/12 lg:w-11/12">
			<div class="w-full sm:mx-5 lg:w-2/3 xl:w-9/12">
				<button
					@click="newPostScroll"
					class="flex flex-row items-center p-1 mx-auto transition-all rounded-full shadow-md group hover:bg-nord7 noOutline bg-nord8 z-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="w-8 h-auto transition-all fill-current group-hover:text-nord4 text-nord6"
					>
						<path
							d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.58l5.995 5.988-1.416 1.414-4.579-4.574-4.59 4.574-1.416-1.414 6.006-5.988z"
						/>
					</svg>
					<h1 class="px-3 font-semibold text-nord6 group-hover:text-nord4">
						New Posts
					</h1>
				</button>
			</div>
		</div>
	</div>
	<div class="w-full pt-6 mx-auto xl:w-9/12 lg:w-11/12 bg-nord0 z-2">
		<div class="pb-2 border rounded-lg shadow-md px-9 pt-7 bg-nord1 border-nord2">
			<div class="flex flex-row items-center justify-between">
				<div>
					<div class="block pl-3">
						<h1 class="text-4xl font-bold text-nord5">
							Welcome to not-reddit
						</h1>
						<p class="mt-6 overflow-x-visible overflow-y-hidden break-words text-md text-nord4">
							(this isn't reddit)
						</p>
					</div>

					<div class="flex flex-row items-center w-full mt-5">
						<router-link
							class="px-2 py-1 transition-all rounded-md hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
							to="/create"
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
					</div>
				</div>
				<img src="../assets/logo.webp" class="hidden w-20 md:block" />
			</div>
		</div>
	</div>
	<div class="flex justify-between w-full max-w-full pt-2 mx-auto mt-3 lg:mt-4 xl:max-w-9/12 lg:max-w-11/12 xl:w-9/12 lg:w-11/12">
		<transition-group name="posts" tag="div" class="w-full max-w-full md:w-35/50 xl:w-37/50">
			<Post v-for="post in store.subreddit.state.homePosts" :key="post.id" :post="post" location="home" />
			<div class="w-full h-1" id="sB" key="bottomScrollCalc"></div>
		</transition-group>
		<div class="hidden md:w-14/50 md:block xl:w-1/4 md:min-w-14/50 xl:min-w-1/4">
			<div class="sticky overflow-y-auto md:top-16 max-h-90vh" id="sidebar">
				<SubredditSidebar />
				<InfoSidebar />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
		document.title = '(not) reddit';

		store.subreddit.actions.bindAllPosts();

		document.addEventListener('scroll', () => {
			if (window.scrollY < 10 && store.subreddit.state.scrollNotif) store.subreddit.state.scrollNotif = false;
		});

		function newPostScroll() {
			window.scrollTo(0, 0);
			store.subreddit.state.scrollNotif = false;
		}

		return {
			store,
			newPostScroll,
		};
	},
});
</script>

<style lang="stylus">
@import '../assets/styles.styl';

.fixedCenter {
	left: 50%
	margin-right: -50%
	transform: translate(0%, -50%)
}
.posts-enter-active,
.posts-leave-active {
	transition: all 1s ease
}
.posts-leave-to {
	opacity: 0
	margin-top: -190px
}

#sidebar::-webkit-scrollbar {
	width: 10px;
}
#sidebar::-webkit-scrollbar-track {
	background: nord0
}
#sidebar::-webkit-scrollbar-thumb {
	background: nord2
	border-radius: 10px;
}
#sidebar::-webkit-scrollbar-thumb:hover {
	background: nord3
}
</style>
