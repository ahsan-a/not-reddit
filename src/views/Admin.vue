<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex justify-between w-full max-w-full xl:max-w-9/12 lg:max-w-11/12 overflow-x-hidden mt-6 pt-2 mx-auto xl:w-9/12 lg:w-11/12">
		<div
			class="w-full max-w-full px-6 py-5 mx-1 rounded-lg shadow-sm md:mr-7 lg:w-8/12 xl:w-3/4 bg-nord1"
			v-if="store.auth.state.user?.admin"
		>
			<h1 class="text-2xl font-bold text-nord6">Admin</h1>

			<h1 class="mt-5 text-xl font-semibold text-nord6">
				Moderate Subreddits
			</h1>

			<div class="mt-6 overflow-hidden border-b rounded-lg border-nord2">
				<table class="min-w-full mx-auto divide-y shadow divide-nord1">
					<tbody class="divide-y bg-nord2 divide-nord1">
						<tr
							v-for="subreddit in store.admin.state.subreddits"
							:key="subreddit.id"
							class="transition duration-150 ease-out "
						>
							<td class="px-4 py-2">
								<div class="flex flex-row items-center">
									<img
										:src="
											subreddit.image ||
												require('../assets/defaultSub.svg')
										"
										class="hidden object-cover w-10 h-10 ml-4 mr-4 rounded-full md:inline-block"
									/>
									<div
										class="text-sm font-medium break-words text-nord4 subreddit"
									>
										r/{{ subreddit.name }}
									</div>
								</div>
							</td>
							<td
								class="hidden px-4 py-4 overflow-y-hidden sm:block"
							>
								<div
									class="text-sm break-words text-nord4 description"
								>
									{{ subreddit.description }}
								</div>
							</td>
							<td class="px-4 text-center py hideOnMd">
								<span
									class="text-sm font-medium text-center text-nord4"
								>
									{{ subreddit.user?.name || 'Deleted User' }}
									<br />
								</span>
							</td>
							<td class="px-4 py-4 overflow-y-hidden">
								<div
									class="flex flex-row items-center text-nord4"
								>
									<button
										class="noOutline"
										@click="
											store.admin.actions.denySubreddit(
												subreddit.id
											)
										"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											class="w-5 transition-all fill-current hover:text-nord12 text-nord11"
										>
											<path
												d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
											/>
										</svg>
									</button>

									<button
										class="ml-3 noOutline"
										@click="
											store.admin.actions.approveSubreddit(
												subreddit.id
											)
										"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											class="w-5 transition-all fill-current hover:text-nord7 text-nord14"
										>
											<path
												d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
											/>
										</svg>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div
			class="w-full max-w-full px-6 py-5 mx-1 rounded-lg shadow-sm md:mx-10 lg:w-8/12 xl:w-3/4 bg-nord1"
			v-else
		>
			<h1 class="font-bold text-8xl text-nord4">ayo wtf</h1>
		</div>
		<div class="hidden lg:w-4/12 lg:block xl:w-1/4 lg:min-w-4/12 xl:min-w-1/4">
			<SubredditSidebar />
			<InfoSidebar />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import InfoSidebar from '@/components/InfoSidebar.vue';

export default defineComponent({
	components: {
		Navbar,
		SubredditSidebar,
		InfoSidebar,
	},
	setup() {
		document.title = 'Admin | (not) reddit';
		store.admin.actions.bindSubreddits();

		return {
			store,
		};
	},
});
</script>

<style lang="stylus"></style>
