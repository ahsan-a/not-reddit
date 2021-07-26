<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full pt-2 mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1">
			<h1 class="text-2xl font-bold text-nord6">Privacy Policy</h1>
			<p class="mt-3 text-nord4">
				We collect and use your data to provide and improve the service. By using the service, you agree to the collection and use of
				information in accordance with this policy.
			</p>
			<h1 class="mt-3 text-lg font-semibold text-nord6">User Data</h1>
			<p class="mt-3 text-nord4">
				Information that we need to function is stored in our database. This includes your name, profile picture and user ID. Your email is
				visible only by Ahsan but will never be public or used. We use Firebase, which means any information collected by firebase can be
				accessible, but we only access whatever is listed above.
				<a href="https://firebase.google.com/support/privacy" class="text-nord8 hover:underline">You can view their privacy policy here.</a>

				Your data for every comment, post and subreddit is visible for as long as they exist, until they are deleted. Deleted subreddits and
				posts are deleted from the database while deleted comments have all important data stripped.
			</p>
			<h1 class="mt-3 text-lg font-semibold text-nord6">Cookies and Analytics</h1>
			<p class="mt-3 text-nord4">
				Google analytics is used to measure activity on the site.
				<a href="https://policies.google.com/privacy?hl=en" class="text-nord8 hover:underline">You can view the policy here. </a>

				Cookies are also used to keep authentication between sessions. The only cookies used are default with Google Analytics and Firebase.
			</p>
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
