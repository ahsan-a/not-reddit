<template>
	<div class="fixed w-screen h-screen bg-nord0 -z-1"></div>
	<Navbar :padding="true" />
	<div class="flex flex-col w-11/12 mx-auto xl:w-4/6 lg:w-5/6 subreddits">
		<button
			class="block px-4 py-2 mx-auto mb-5 text-xl font-medium transition-colors rounded-md shadow-sm outline-none button bg-nord8 hover:bg-nord7 text-nord5 createSubredditButton"
			@click="createSubredditOn = !createSubredditOn"
			v-if="store.auth.state.isLoggedIn"
		>
			Create Subreddit
		</button>

		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
			<div class="overflow-hidden border-b md:rounded-lg border-nord2">
				<table class="min-w-full mx-auto divide-y shadow divide-nord1">
					<thead class="bg-nord1">
						<tr>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase sm:text-left text-nord5">
								Subreddit
							</th>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-nord5 hideOnSm">
								Description
							</th>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-nord5 createdAt hideOnMd">
								Created At
							</th>
						</tr>
					</thead>
					<tbody class="divide-y bg-nord2 divide-nord1">
						<tr
							v-for="subreddit in store.subreddits.state.subreddits"
							:key="subreddit.id"
							class="transition duration-150 ease-out cursor-pointer hover:bg-nord3"
							@click="router.push({ path: `/r/${subreddit.name}` })"
						>
							<td class="px-4 py-4">
								<div class="flex items-center">
									<div class="ml-4">
										<div class="text-sm font-medium break-words text-nord4 subreddit"> r/{{ subreddit.name }} </div>
									</div>
								</div>
							</td>
							<td class="px-4 py-4 hideOnSm">
								<div class="text-sm break-words text-nord4 description">
									{{ subreddit.description }}
								</div>
							</td>
							<td class="px-4 text-center py createdAt hideOnMd">
								<span class="text-sm font-medium text-center text-nord4 createdAt">
									{{ getDate(subreddit.created_at.seconds) }}
									<br />
								</span>
							</td>
						</tr>

						<!-- More items... -->
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { useRouter } from 'vue-router';
	import store from '@/store';

	import Navbar from '@/components/Navbar.vue';

	export default defineComponent({
		components: {
			Navbar,
		},
		setup() {
			store.subreddits.actions.bindSubreddits();
			const router = useRouter();

			const getDate = (unix: number) => new Date(unix * 1000).toLocaleDateString();
			return {
				store,
				router,
				getDate,
			};
		},
	});
</script>

<style lang="stylus" scoped>
	.hideOnMd {
		@media screen and (min-width: 768px) {
			visibility: visible
		}
		@media screen and (max-width: 767px) {
			visibility: hidden
			display: none
		}
	}
	.hideOnSm {
		@media screen and (min-width: 640px) {
			visibility: visible
		}
		@media screen and (max-width: 639px) {
			visibility: hidden
			display: none
		}
	}
</style>
