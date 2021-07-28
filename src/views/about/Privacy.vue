<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full pt-2 mx-auto xl:w-9/12 lg:w-11/12">
		<div
			class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm lg:w-9/12 md:mr-5 bg-nord1 markdownRender text-nord4"
			id="privacy"
		>
			<h1 class="text-2xl font-bold text-nord6">Privacy Policy</h1>
			<p class="mt-5">
				We collect data in accordance to our privacy policy in order to
				provide and improve the service. By using the service, you agree
				to the collection of your data in accordance with our privacy
				policy. If you have any questions or concerns about this privacy
				notice, or our practices with regards to your personal
				information, please contact
				<a href="mailto:ahsanthrowaway@gmail.com" target="_blank"
					>ahsanthrowaway@gmail.com</a
				>.
			</p>
			<h2 id="what-information-do-we-collect">
				What Information Do We Collect?
			</h2>
			<h3 id="personal-information-you-disclose-to-us">
				Personal information you disclose to us
			</h3>
			<p>
				<strong>In Short:</strong> We collect information that you
				provide to us.
			</p>
			<br />
			<p>
				We collect information that is voluntarily provided to us by you
				when you register to the website, and participate in the website
				(via posting, commenting, updating your profile and creating
				sub(not)reddits).
			</p>
			<h4 id="personal-information-provided-by-you">
				Personal Information Provided by You
			</h4>
			<p>
				We collect names, authentication data, profile images, signup
				date and last login date, which are all accessible. Your email
				is collected on sign in but will never be shared.
			</p>
			<h3 id="information-automatically-collected">
				Information automatically collected
			</h3>
			<p>
				<strong>In Short:</strong> Some information, including and not
				limited to your IP address, browser and device characteristics
				is collected automatically when you visit our website via Google
				Analytics. This is to measure site engagement, usage and uptime.
			</p>
			<br />
			<p>
				We automatically collect certain information when you visit the
				website. This information does not reveal your specific identity
				(like your name or contact information) but may include device
				and usage information, such as your IP address, browser and
				device characteristics, operating system, language preferences,
				referring URLs, device name, country, location, information
				about how and when you use our website. This is all done
				automatically through Google Analytics.
				<a href="https://support.google.com/analytics/answer/6004245"
					>Learn more here.</a
				>
				To opt out, you can use extensions such as
				<a href="https://tools.google.com/dlpage/gaoptout"
					>Google Analytics Opt Out</a
				>
				or privacy focused browsers such as
				<a href="https://brave.com/">Brave</a> that come with tracker
				blockers. Blocking Google Analytics should not affect the site.
			</p>
			<h2 id="how-do-we-use-your-information">
				How Do We Use Your Information?
			</h2>
			<ul>
				<li>To facilitate the account creation and logon process.</li>
				<li>
					To handle the creator of posts, comments, subreddits and
					notifications.
				</li>
			</ul>
			<h2 id="will-your-information-be-shared-with-anyone">
				Will Your Information Be Shared With Anyone?
			</h2>
			<p>
				All the information collected excluding your email is used to
				build your profile for the purpose of letting the site function.
				This is all public.
			</p>
			<h2 id="how-are-cookies-used">How Are Cookies Used?</h2>
			<p>Cookies are used for authentication and analytics purposes.</p>
			<h2 id="how-long-do-we-keep-your-information">
				How Long Do We Keep Your Information?
			</h2>
			<p>
				Your information is kept indefinitely, until an account deletion
				request is sent to our contact email. After your user profile is
				deleted, your user id may still be linked to submissions made on
				this website, but won’t be linked to you unless you decide to
				re-create your account with the same account from the same login
				provider.
			</p>
			<h2
				id="how-can-you-view-or-request-the-data-that-we-collect-from-you"
			>
				How Can You View or Request The Data That We Collect From You?
			</h2>
			<p>
				All of your posts and comments are accessible via your user
				profile. Your profile image, username and about are editable
				through the options section. If you would like to request the
				data that we collect from you, send an email to
				<a href="mailto:ahsanthrowaway@gmail.com" target="_blank"
					>ahsanthrowaway@gmail.com</a
				>.
			</p>
		</div>
		<div class="hidden md:w-1/3 md:block xl:w-3/12">
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
