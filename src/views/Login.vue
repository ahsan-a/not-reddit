<template>
	<title>Login | not-reddit</title>
	<div class="bg" />
	<div class="h-screen">
		<Navbar class="absolute" />
		<!-- Container -->
		<div class="flex items-center h-full">
			<div class="container mx-auto">
				<div class="flex justify-center px-6">
					<!-- Row -->
					<div class="flex w-full xl:w-3/4 lg:w-11/12">
						<!-- Col -->
						<img
							class="hidden object-cover w-full h-auto bg-gray-400 bg-cover rounded-l-lg lg:block lg:w-1/2"
							src="../assets/images/winxp.webp"
						/>
						<!-- Col -->
						<div
							class="w-full h-full p-5 rounded-lg lg:w-1/2 bg-nord1 lg:rounded-l-none"
							v-if="!store.auth?.state.isLoggedIn"
						>
							<h3
								class="pt-4 text-3xl font-semibold text-center text-nord6"
							>
								Sign In
							</h3>
							<h4 class="text-nord4 text-sm mt-4 mx-6 text-center">
								By using this site, you agree to our
								<router-link to="/about/privacy"
								class="text-nord8 hover:underline"
									>Privacy Policy</router-link
								>
								and agree to follow our
								<router-link to="/about/guidelines"
								class="text-nord8 hover:underline"
									>Community Guidelines</router-link
								>.
							</h4>
							<div
								class="flex flex-col items-center justify-center mb-5 mt-3 md:mt-5"
							>
								<button
									class="inline-block my-1 text-center transition-all bg-blue-400 rounded-md group hover:bg-blue-500 active:bg-blue-600"
									@click="loginWithProvider('google')"
								>
									<img
										src="https://iconape.com/wp-content/files/uy/64779/svg/google-icon.svg"
										class="inline-block w-10 p-2 bg-white rounded-l-md group-hover:bg-nord5"
									/>
									<span class="px-2 font-semibold text-nord5"
										>Sign in with Google</span
									>
								</button>
								<button
									class="inline-block my-1 text-center transition-all bg-gray-800 rounded-md group hover:bg-gray-900"
									@click="loginWithProvider('github')"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
										class="inline-block w-10 p-1.5 bg-white rounded-l-md group-hover:bg-nord5"
									/>
									<span class="px-2 font-semibold text-nord5"
										>Sign in with Github</span
									>
								</button>
							</div>
						</div>

						<div
							class="w-full h-full p-5 rounded-lg lg:w-1/2 bg-nord1 lg:rounded-l-none"
							v-else
						>
							<h3
								class="pt-4 text-3xl font-semibold text-center text-nord6"
							>
								You are signed in.
							</h3>
							<div
								class="flex flex-col items-center justify-center my-10 md:mt-12"
							>
								<button
									class="p-2 px-4 text-lg font-semibold text-center transition-all bg-blue-400 rounded-md text-nord5 group hover:bg-blue-500 active:bg-blue-600"
									@click="firebase.auth().signOut()"
								>
									Sign Out
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useRouter } from 'vue-router';

import firebase from '@/firebase';
import store from '@/store';

export default defineComponent({
	components: {
		Navbar,
	},
	setup() {
		document.title = 'login | (not) reddit';
		const router = useRouter();
		async function loginWithProvider(type: string) {
			let authProvider;
			switch (type.toLowerCase()) {
				case 'github':
					authProvider = new firebase.auth.GithubAuthProvider();
					break;
				default:
					authProvider = new firebase.auth.GoogleAuthProvider();
					break;
			}
			await store.auth.actions.loginPrompt(authProvider);

			if (window.history.state.back) router.go(-1);
			else router.push({ path: '/' });
		}

		return {
			firebase,
			store,
			loginWithProvider,
			router,
		};
	},
});
</script>
