<template>
	<div class="fixed w-screen h-screen bg-nord0 -z-1"></div>
	<Navbar :padding="true" />
	<div class="flex flex-col w-11/12 mx-auto xl:w-4/6 lg:w-5/6 subreddits">
		<button
			class="block px-4 py-2 mx-auto mb-5 text-xl font-medium transition-colors rounded-md shadow-sm button bg-nord8 hover:bg-nord7 text-nord5 createSubredditButton noOutline"
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

	<div class="absolute createSubredditWrapper" v-if="createSubredditOn">
		<div class="absolute flex-col w-full h-full shadow-lg createSubreddit bg-nord2 rounded-2xl">
			<div class="w-full h-12 top bg-nord1 rounded-t-2xl">
				<button
					class="float-right w-5 h-5 mt-4 mr-4 transition-all rounded-full closeSubredditMenu bg-nord11 hover:bg-nord12"
					@click="createSubredditOn = false"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" class="fill-current text-nord4 ">
						<path
							d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
						/>
					</svg>
				</button>
			</div>
			<div class="content">
				<form @submit.prevent>
					<div class="w-full mt-10 mb-10 subredditName">
						<h1 class="text-3xl text-nord6 whitespace-nowrap">
							Subreddit Name
						</h1>
						<input
							type="text"
							placeholder="Subreddit Name (required)"
							class="block w-full h-12 px-5 mx-auto mt-5 text-xl transition-all border-none outline-none focus:outline-none focus:border-none bg-nord3 rounded-xl text-nord6 focus:shadow-md placeholder-nord4"
							maxlength="25"
							required
							v-model="currentInput.name"
							pattern=".*\S+.*"
							title="Required"
						/>
					</div>
					<div class="subredditDesc">
						<h1 class="text-3xl text-nord6 whitespace-nowrap">
							Subreddit Description
						</h1>
						<textarea
							placeholder="Subreddit Description"
							class="block w-full px-5 pt-3 mx-auto mt-5 text-xl transition-all border-none outline-none focus:outline-none focus:border-none descText bg-nord3 rounded-xl text-nord6 focus:shadow-md placeholder-nord4"
							maxlength="100"
							required
							v-model="currentInput.description"
							pattern=".*\S+.*"
							title="Required"
						/>
					</div>
					<button
						class="block px-4 py-2 mx-auto mt-10 text-xl font-medium transition-colors rounded-md shadow-sm noOutline button bg-nord8 hover:bg-nord7 text-nord5 createSubredditButton"
						@click="createSubreddit"
					>
						Create Subreddit
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, reactive } from 'vue';
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
			const createSubredditOn = ref(false);
			const currentInput = reactive({
				name: '',
				description: '',
			});

			const getDate = (unix: number) => new Date(unix * 1000).toLocaleDateString();

			async function createSubreddit() {
				if (!store.auth.state.isLoggedIn) return alert('Please make an account or sign in to make a subreddit.');
				if (/\s/g.test(currentInput.name)) return alert('Your title must not have any spaces.');
				if (!/^[0-9a-zA-Z]+$/.test(currentInput.name)) return alert('Your title must not contain special characters.');
				if (!currentInput.name.replace(/\s/g, '').length) return alert('Your title cannot be empty.');
				if (!currentInput.description.replace(/\s/g, '').length) return alert('Your description must not be empty.');
				if (store.subreddits.state.subreddits.some((x) => x.name.toLowerCase() === currentInput.name.toLowerCase()))
					return alert('This subreddit already exists.');

				currentInput.description = currentInput.description.replace(/\r?\n|\r/g, ' ');

				console.log(currentInput);
				console.log(store.auth.state.user);
			}

			return {
				store,
				router,
				getDate,
				createSubredditOn,
				currentInput,
				createSubreddit,
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

	.createSubredditWrapper {
		width 1000px
		height 65vh
		left 50%
		right 50%
		top 50%
		transform translate(-50%, -50%)
		@media (max-width 1000px) {
			width 95vw
			height 85vh
		}
		.top {
			display inline-block
			flex-direction column
			justify-content center
		}
		.closeSubredditMenu {
			display flex
			justify-content center
			align-items center
			border 0
			outline 0
			&:active {
				background-color nord13
			}
			&:hover {
				transform: rotate(90deg);
			}
		}
		.content {
			width 60%
			position absolute
			left 50%
			right 50%
			transform translate(-50%, 0%)
			.descText {
				min-height 9rem
				max-height 9rem
				@media (max-width 1000px) {
					min-height 16rem
					max-height 16rem
				}
			}
		}
	}
	.noOutline {
		border: 0 !important
		outline: 0 !important
	}
</style>
