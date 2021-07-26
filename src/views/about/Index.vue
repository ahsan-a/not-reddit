<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full pt-2 mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1">
			<h1 class="text-2xl font-bold text-nord6">About</h1>
			<p class="mt-3 text-nord4">
				redit (but, not reddit)
			</p>

			<div class="mt-6 font-medium text-nord8">
				<router-link to="/about/privacy" class="hover:underline">Privacy Policy</router-link>
				<br />
				<router-link to="/about/user" class="hover:underline">User Agreement</router-link>
				<br />
				<router-link to="/about/content" class="hover:underline">Content Policy</router-link>
			</div>
		</div>
		<div class="hidden lg:w-1/3 lg:block xl:w-3/12">
			<div class="sticky mt-6 top-16">
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
		document.title = 'About | (not) reddit';

		return {
			store,
		};
	},
});
</script>
