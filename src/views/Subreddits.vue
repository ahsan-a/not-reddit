<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex flex-col w-11/12 mx-auto xl:w-4/6 lg:w-5/6 subreddits">
		<button class="mx-auto mt-5 button-blue" @click="createSubredditOn = !createSubredditOn" v-if="store.auth.state.isLoggedIn">
			Create a Subreddit
		</button>

		<div class="inline-block min-w-full py-2 mt-5 align-middle sm:px-6 lg:px-8">
			<div v-if="createSubredditOn" class="px-4 py-5 mb-6 rounded-lg lg:px-32 md:py-10 bg-nord1">
				<h1 class="text-3xl font-semibold mb-7 text-nord6">Create a Subreddit</h1>

				<form @submit.prevent="createSubreddit">
					<span class="text-lg font-semibold text-nord5">Subreddit Name</span>
					<span class="text-lg font-semibold text-red-400"> *</span>
					<input
						type="text"
						placeholder="Subreddit Name"
						class="block w-full h-12 px-5 mx-auto mt-2 mb-4 font-semibold transition-all border-none rounded-md shadow-sm outline-none text-md focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
						maxlength="25"
						required
						v-model="currentInput.name"
						@keydown.space.prevent
						title="Required"
					/>
					<span class="text-lg font-semibold text-nord5">Subreddit Description</span>
					<span class="text-lg font-semibold text-red-400"> *</span>
					<textarea
						placeholder="Subreddit Description"
						class="block w-full h-24 px-5 pt-3 mx-auto mt-2 font-semibold transition-all border-none rounded-md outline-none resize-none text-md focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
						maxlength="150"
						required
						v-model="currentInput.description"
						title="Required"
					/>

					<h2 class="mt-4 text-lg font-semibold text-nord5">Subreddit Image URL</h2>
					<input
						type="text"
						placeholder="Subreddit Image"
						class="block w-full h-12 px-5 mx-auto mt-2 font-semibold transition-all border-none rounded-md shadow-sm outline-none text-md focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
						v-model="currentInput.image"
						@keydown.space.prevent
						title="Required"
					/>
					<button type="submit" class="block mx-auto mt-6 button-green">Submit</button>
				</form>
			</div>
			<div class="overflow-hidden border-b rounded-lg border-nord2">
				<table class="min-w-full mx-auto divide-y shadow divide-nord1">
					<thead class="bg-nord1">
						<tr>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase sm:text-left text-nord5">
								Subreddit
							</th>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-nord5 hideOnSm">
								Description
							</th>
							<th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-nord5 hideOnMd">
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
							<td class="px-4 py-2">
								<div class="flex flex-row items-center">
									<img
										:src="subreddit.image ? `${subreddit.image}?size=64` : require('../assets/defaultSub.svg')"
										class="object-cover w-10 h-10 ml-4 mr-4 rounded-full"
									/>
									<div class="text-sm font-medium break-words text-nord4 subreddit"> r/{{ subreddit.name }} </div>
								</div>
							</td>
							<td class="px-4 py-4 overflow-y-hidden hideOnSm">
								<div class="text-sm break-words text-nord4 description">
									{{ subreddit.description }}
								</div>
							</td>
							<td class="px-4 text-center py hideOnMd">
								<span class="text-sm font-medium text-center text-nord4 ">
									{{ subreddit.created_at.toDate().toLocaleDateString() }}
									<br />
								</span>
							</td>
						</tr>
					</tbody>
				</table>
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
		document.title = 'subreddits | (not) reddit';
		store.subreddits.actions.bindSubreddits();
		const router = useRouter();
		const createSubredditOn = ref(false);
		const currentInput = reactive({
			name: '',
			description: '',
			user_id: '',
			image: '',
		});

		async function createSubreddit() {
			if (!store.auth.state.isLoggedIn) return alert('Please make an account or sign in to make a subreddit.');
			if (/\s/g.test(currentInput.name)) return alert('Your title must not have any spaces.');
			if (!/^[0-9a-zA-Z]+$/.test(currentInput.name)) return alert('Your title must not contain special characters.');
			if (!currentInput.name.replace(/\s/g, '').length) return alert('Your title cannot be empty.');
			if (!currentInput.description.replace(/\s/g, '').length) return alert('Your description must not be empty.');
			if (currentInput.image.length && !currentInput.image.match(/^https:\/\/cdn.discordapp.com\/\w+\/\d+\/.+.\w+$/gi))
				return alert(`Your image must be blank or a  discord image link with no url parameters.
				Example: https://cdn.discordapp.com/attachments/840294039861723166/855395382720331776/maxresdefault.png
				To do this you can send an image to someone in a DM, click on the image, and copy the "Open Original" URL.
				`);
			if (store.subreddits.state.subreddits.some((x) => x.name.toLowerCase() === currentInput.name.toLowerCase()))
				return alert('This subreddit already exists.');

			currentInput.description = currentInput.description.replace(/\r?\n|\r/g, ' ');
			currentInput.user_id = store.auth.state.user.id || '3zmYQVHUzPPIp7mBeDV8O7ujMNr1';

			await store.subreddits.actions.submitNewSubreddit(currentInput);
			currentInput.name = '';
			currentInput.description = '';
			currentInput.image = '';
			createSubredditOn.value = false;
		}

		return {
			store,
			router,
			createSubredditOn,
			currentInput,
			createSubreddit,
		};
	},
});
</script>

<style lang="stylus" scoped>
@import '../assets/styles.styl';

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
