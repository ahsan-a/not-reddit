<template>
	<div class="bg" />
	<Navbar />
	<div class="h-16" id="scrollTop"></div>
	<Topbar />
	<div
		class="flex justify-between w-full max-w-full mx-auto mt-6 xl:max-w-9/12 lg:max-w-11/12 xl:w-9/12 lg:w-11/12"
	>
		<transition-group
			name="posts"
			tag="div"
			class="w-full max-w-full md:w-35/50 xl:w-37/50"
		>
			<Post
				v-for="post in store.subreddit.state.posts"
				:key="post.id"
				:post="post"
			/>
			<div class="w-full h-1" id="sB" key="bottomScrollCalc"></div>
		</transition-group>

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
import { defineComponent, ref } from 'vue';
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
		Topbar
	},
	setup() {
		const local = ref(store.subreddit.state);

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