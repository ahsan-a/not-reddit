<template>
	<nav class="fixed w-full nav bg-nord0">
		<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<button class="flex-shrink-0 noOutline" @click="router.push({ path: '/' })">
						<img class="h-12 cursor-pointer" src="../assets/logo.png" alt="not reddit" />
					</button>
					<button class="px-5 text-3xl cursor-pointer text-nord6 navbarLogoText noOutline" @click="router.push({ path: '/' })">
						(not) reddit
					</button>

					<div class="hidden md:block">
						<div class="flex items-baseline ml-10 space-x-4 text-sm font-medium tracking-wider text-nord4">
							<button
								class="px-3 py-2 text-sm font-medium uppercase transition-colors rounded-md cursor-pointer text-nord5 hover:bg-nord3 noOutline"
								@click="router.push({ path: '/subreddits' })"
							>
								Subreddits
							</button>
						</div>
					</div>
					<div class="hidden md:block" v-if="store.auth.state.user?.admin">
						<div class="flex items-baseline ml-10 space-x-4 text-sm font-medium tracking-wider uppercase text-nord4">
							<a
								class="px-3 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer text-nord5 hover:bg-nord3"
								@click="router.push({ path: '/admin' })"
							>
								Admin
							</a>
						</div>
					</div>
				</div>
				<div class="hidden md:block">
					<div class="flex items-center ml-4 md:ml-6">
						<!-- Profile dropdown -->
						<div class="ml-3 menu" v-if="store.auth.state.isLoggedIn">
							<div>
								<button
									class="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-nord1 focus:ring-nord5"
									id="user-menu"
									aria-haspopup="true"
									@click="profileHover = !profileHover"
									@blur="PHFalse"
								>
									<span class="sr-only">Open user menu</span>
									<img class="w-8 h-8 rounded-full" :src="store.auth.state.user.image" />
								</button>
							</div>
							<div
								class="fixed w-48 pt-1 mt-2 rounded-md shadow-lg bg-nord1 ring-1 ring-nord0 ring-opacity-5 userMenu"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu"
								v-if="profileHover"
							>
								<p class="block px-4 py-2 text-sm font-semibold text-nord6">
									{{ store.auth.state.user.name }}
								</p>
								<a
									href="#"
									class="block px-4 py-2 text-sm transition-colors rounded-md text-nord6 hover:bg-nord2"
									role="menuitem"
									@click="
										profileHover = false;
										firebase.auth().signOut();
									"
									>Sign out</a
								>
							</div>
						</div>

						<div class="relative ml-3" v-else>
							<div class="flex ml-10 space-x-4">
								<button
									class="py-1 pl-2 pr-4 space-x-4 text-sm font-medium transition-colors rounded-md text-nord6 googleButton noOutline"
									@click="router.push({ path: '/login' })"
									@mousedown.middle="newtab('/admin')"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										class="transition-all fill-current w-9 h-9 text-nord8 hover:text-nord7"
									>
										<path
											d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="flex -mr-2 md:hidden">
					<!-- Mobile menu button -->
					<button
						type="button"
						class="inline-flex items-center justify-center p-2 mr-5 fill-current bg-nord0 text-nord4 noOutline"
						aria-controls="mobile-menu"
						aria-expanded="false"
						@click="profileHover = !profileHover"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current text-nord4"
							v-if="!profileHover"
						>
							<path d="M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" v-else>
							<path
								d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="fixed w-screen shadow-lg md:hidden bg-nord1" id="mobile-menu" v-if="profileHover">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<button
					class="block px-3 py-2 text-base font-medium text-center transition-colors rounded-md text-nord5 hover:bg-nord2 noOutline"
					@click="
						PHFalse();
						router.push({ path: '/subreddits' });
					"
				>
					Subreddits
				</button>
				<button
					class="block px-3 py-2 text-base font-medium text-center transition-colors rounded-md text-nord5 hover:bg-nord2 noOutline"
					@click="
						PHFalse();
						router.push({ path: '/login' });
					"
					v-if="!store.auth.state.isLoggedIn"
				>
					Sign In
				</button>
				<button
					class="block px-3 py-2 text-base font-medium text-center transition-colors rounded-md text-nord5 hover:bg-nord2 noOutline"
					@click="
						PHFalse();
						firebase.auth().signOut();
					"
					v-else
				>
					Sign Out
				</button>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
	import { defineComponent, ref } from 'vue';
	import { useRouter } from 'vue-router';

	import firebase from '@/firebase';
	import store from '@/store';

	export default defineComponent({
		setup() {
			const profileHover = ref(false);
			const router = useRouter();
			function PHFalse() {
				setTimeout(() => {
					profileHover.value = false;
				}, 150);
			}
			return {
				profileHover,
				PHFalse,
				router,
				store,
				firebase,
			};
		},
	});
</script>

<style lang="stylus" scoped>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500');
	// nord0 = #2e3440
	// nord1 = #3b4252
	// nord2 = #434c5e
	// nord3 = #4c566a
	nord4 = #d8dee9
	// nord5 = #e5e9f0
	// nord6 = #eceff4
	// nord7 = #8fbcbb
	// nord8 = #88c0d0
	// nord9 = #81a1c1
	// nord10 = #5e81ac
	// nord11 = #bf616a
	// nord12 = #d08770
	// nord13 = #ebcb8b
	// nord14 = #a3be8c
	// nord15 = #b48ead
	.navbarLogoText {
		font-family 'Quicksand', sans-serif
	}
	.userMenu {
		margin-left -8.2vw
		margin-top 20px
		@media (max-width 1325px) {
			margin-left -16vw
		}
	}
	.gooogleButton:focus {
		border none
		outline none
	}
	.noOutline {
		border 0
		outline 0
	}
	.nav {
		overflow-x: hidden !important
	}
</style>
