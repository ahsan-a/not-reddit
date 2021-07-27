<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full pt-2 mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1 markdownRender text-nord4" id="privacy">
			<h1 class="text-2xl font-bold text-nord6">Guidelines</h1>
			<p
				>(not) reddit was made for fun. However, these rules were put in place to keep this place fun. If you come across anything that breaks
				these guidelines, <strong>please report it to us</strong>, through <a href="mailto:ahsanthrowaway@gmail.com">email</a> or discord
				(ahsan#4403).</p
			>
			<h2 id="here-are-our-interaction-rules">Here are our interaction rules:</h2>
			<ol type="1">
				<li
					><strong>Do not organise, participate in, or encourage harassment of others.</strong> Disagreements happen, but remain respectful
					or playful. Attempting to hurt other people and harassment is not okay.</li
				>
				<li
					><strong>Do not organise, promote, or coordinate hate speech.</strong> It’s unacceptable to attack a person or a community based
					on attributes such as their race, ethnicity, national origin, sex, gender, sexual orientation, religious affiliation, or
					disabilities. Respectful discussion is allowed. You don’t have to agree with or support their properties, but remain respectful
					regardless.</li
				>
				<li
					><strong>Do not make threats of violence or threaten to harm others.</strong> This includes indirect threats, as well as sharing
					or threatening to share someone’s private personal information (also known as doxxing).</li
				>
				<li><strong>Do not send others viruses or malware,</strong> attempt to phish others, or hack or DDoS them.</li>
				<li
					><strong>Do not spam (not) reddit.</strong> This includes anything from posts, subreddit requests and comments. Moderators decide
					what is considered spam. Spammers will have appropriate measures taken against them. Advertising paid items is also forbidden.</li
				>
			</ol>
			<h2 id="and-content-rules">And content rules:</h2>
			<ol type="1">
				<li
					><strong>No NSFW content.</strong> Moderators get the final say in what is considrered NSFW. This includes nudity or age
					restricted, adult content in posts, links and avatars.</li
				>
				<li
					><strong>You may not share content that glorifies or promotes suicide or self-harm</strong>, including any encouragement to others
					to cut themselves, or embrace eating disorders such as anorexia or bulimia.</li
				>
				<li><strong>You cannot share images of sadistic gore or animal cruelty.</strong></li>
				<li><strong>You may not use Discord for the organization, promotion, or support of extremism.</strong></li>
				<li
					>In general, <strong>you should not promote, encourage or engage in any illegal behavior.</strong> This will likely get you
					banned. If you have any questions on what is considered ok, contact me.</li
				>
			</ol>
			<h2 id="if-you-see-any-activity-that-violates-these-guidelines-report-it-immediately-to-the-contact-details-provided."
				>If you see any activity that violates these guidelines, report it immediately to the contact details provided.</h2
			>
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

<style lang="stylus" scoped></style>
