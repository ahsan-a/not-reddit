<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex justify-between w-full max-w-full pt-2 mx-auto mt-4 xl:max-w-9/12 lg:max-w-11/12 xl:w-9/12 lg:w-11/12">
		<div class="w-full max-w-full mx-5 md:w-35/50 xl:w-37/50">
			<div class="px-6 pt-6 rounded-lg bg-nord1">
				<div class="flex flex-row items-center justify-between">
					<span class="flex flex-row items-center overflow-y-hidden">
						<img :src="user?.image || require('../assets/defaultPfp.webp')" class="object-cover w-10 h-auto mr-3 rounded-full" />
						<span class="text-2xl font-bold text-nord6">{{ user?.name }}</span>
					</span>
					<span class="flex-row items-center hidden sm:flex" v-if="user?.lastLoggedIn">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-5 mr-2 fill-current text-nord8">
							<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-7v-8h2v6h5v2z" />
						</svg>
						<h1 class="text-sm font-medium text-nord4"> {{ format(user?.lastLoggedIn.toDate()) }}</h1>
					</span>
				</div>
				<p v-if="user?.about" class="mt-6 overflow-y-hidden text-base text-nord4">
					{{ user?.about }}
				</p>

				<div class="flex flex-row items-center w-full mt-5">
					<div class="flex flex-row">
						<router-link
							class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord3 hover:border-nord2 hover:border-opacity-100"
							:class="{ activeNav: local.menu === 'posts' }"
							@click="local.menu = 'posts'"
							:to="`/u/${route.params.id}`"
							>Posts</router-link
						>
						<router-link
							class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord3 hover:border-nord2 hover:border-opacity-100 "
							:class="{ activeNav: local.menu === 'comments' }"
							:to="`/u/${route.params.id}/comments`"
							@click="local.menu = 'comments'"
							>Comments</router-link
						>
						<router-link
							class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord2 hover:border-nord2 hover:border-opacity-100 "
							:class="{ activeNav: local.menu === 'options' }"
							:to="`/u/${route.params.id}/options`"
							@click="local.menu = 'options'"
							v-if="(store.auth.state.user?.id === user?.id || store.auth.state.user?.admin) && store.auth.state.isLoggedIn"
							>Options</router-link
						>
					</div>
				</div>
			</div>
			<transition-group name="posts" tag="div" class="mt-5" v-if="local.menu === 'posts'">
				<Post v-for="post in store.user.state.posts" :key="post.id" :post="post" location="home" />
			</transition-group>

			<transition-group name="comments" tag="div" class="mt-5" v-if="local.menu === 'comments'">
				<div v-for="comment in store.user.state.comments" :key="comment.id" class="mb-5">
					<router-link
						:to="`/r/${comment.subreddit.name}/${comment.post.id}`"
						class="block w-full px-5 pt-5 border border-opacity-0 rounded-t-lg cursor-pointer hover:border-opacity-100 border-nord2 bg-nord1"
					>
						<div class="flex flex-row items-center">
							<h1 class="overflow-y-hidden text-2xl font-bold break-words lh50 text-nord6">{{ comment.post.title }}</h1>
						</div>
						<div class="flex flex-row items-center justify-between mt-4 mb-2 overflow-y-hidden">
							<router-link :to="`/r/${comment.subreddit.name}`" class="text-sm font-medium text-nord5 hover:underline z-1"
								>r/{{ comment.subreddit.name }}</router-link
							>
							<router-link :to="`/u/${comment.post.user.id}`" class="text-sm font-medium hover:underline z-1 text-nord5">{{
								comment.post.user.name
							}}</router-link>
						</div>
					</router-link>
					<router-link
						class="block w-full px-5 pt-4 border border-opacity-0 rounded-b-lg cursor-pointer bg-nord1 border-nord2 hover:border-opacity-100"
						:to="`/r/${comment.subreddit.name}/${comment.post.id}/${comment.id}`"
					>
						<Subcomment :comment="comment" location="user" />
					</router-link>
				</div>
			</transition-group>
			<div
				v-if="local.menu === 'options' && (store.auth.state.user?.id === user?.id || store.auth.state.user?.admin)"
				class="p-5 mt-3 rounded-lg bg-nord1"
			>
				<h1 class="text-4xl font-bold text-nord5">Options</h1>
				<form @submit.prevent="updateProfile" class="mt-6">
					<h1 class="text-xl font-medium text-nord5">Username</h1>
					<input
						type="text"
						v-model="local.optionsInput.name"
						class="w-3/4 px-3 py-1 mt-1 rounded-md noOutline focus:bg-nord3 text-nord4 focus:text-nord5 bg-nord2"
						maxlength="25"
					/>
					<h1 class="mt-3 text-xl font-medium text-nord5">Image</h1>
					<input
						type="text"
						v-model="local.optionsInput.image"
						class="w-3/4 px-3 py-1 mt-1 rounded-md noOutline focus:bg-nord3 text-nord4 focus:text-nord5 bg-nord2"
						maxlength="1000	"
					/>
					<h1 class="mt-3 text-xl font-medium text-nord5">About</h1>
					<textarea
						type="text"
						v-model="local.optionsInput.about"
						class="w-3/4 px-3 py-1 mt-1 rounded-md resize-none h-44 noOutline focus:bg-nord3 text-nord4 focus:text-nord5 bg-nord2"
						maxlength="400"
					/>

					<div v-if="store.auth.state.user?.admin">
						<h1 class="inline mt-3 text-xl font-medium text-nord5">Admin</h1>
						<input type="checkbox" class="inline ml-4" v-model="local.optionsInput.admin" />
					</div>

					<button type="submit" class="block mx-auto mt-4 button-blue">Save</button>
				</form>
			</div>
			<div v-else-if="local.menu === 'options'" class="p-5 mt-3 rounded-lg bg-nord1"
				><h1 class="text-xl font-semibold text-nord5">This isn't your account.</h1></div
			>
		</div>
		<div class="hidden md:w-14/50 md:block xl:w-1/4 lg:min-w-14/50 xl:min-w-1/4">
			<div class="sticky overflow-y-auto max-h-90vh top-16" id="sidebar">
				<SubredditSidebar />
				<InfoSidebar />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store';
import * as timeago from 'timeago.js';

import Navbar from '@/components/Navbar.vue';
import Post from '@/components/Post.vue';
import Subcomment from '@/components/Subcomment.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import InfoSidebar from '@/components/InfoSidebar.vue';

export default defineComponent({
	components: {
		Navbar,
		SubredditSidebar,
		Post,
		Subcomment,
		InfoSidebar,
	},
	setup() {
		const router = useRouter();
		const route = router.currentRoute;
		const pages = ['posts', 'comments', 'options'];

		const local = reactive({
			menu: 'posts',
			optionsInput: {
				name: store.user.state.currentUser?.name ?? 'New User',
				image:
					store.user.state.currentUser?.image ??
					'https://cdn.discordapp.com/attachments/840294039861723166/855395382720331776/maxresdefault.png',
				about: store.user.state.currentUser?.about ?? '',
				admin: store.user.state.currentUser?.admin ?? false,
			},
		});

		const user = toRefs(store.user.state).currentUser;
		async function init() {
			local.optionsInput = {
				name: store.user.state.currentUser?.name ?? 'New User',
				image:
					store.user.state.currentUser?.image ||
					'https://cdn.discordapp.com/attachments/840294039861723166/855395382720331776/maxresdefault.png',
				about: store.user.state.currentUser?.about || '',
				admin: store.user.state.currentUser?.admin || false,
			};

			local.menu = 'posts';
			if (pages.some((x) => x === route.value.params.page)) local.menu = route.value.params.page.toString();

			if (user.value?.id === route.value.params.id) return;

			store.user.state.posts = [];
			store.user.state.comments = [];
			user.value = null;
			user.value = await store.users.actions.getUser(route.value.params.id.toString());
			if (!store.user.state.currentUser) return router.push({ path: '/404' });
			document.title = `${store.user.state.currentUser.name} | (not) reddit`

			store.user.actions.bindSubmissions((route.value.params.id as string) || '');
		}

		init();

		watch(
			() => [route.value.params.id, route.value.params.page],
			(name) => {
				if (route.value.name === 'User' && name[0]) init();
			}
		);

		const format = (date: Date) => timeago.format(date);

		async function updateProfile() {
			if (!user.value) return;
			let input = local.optionsInput;

			if (input.name.length > 25 || input.name.length < 3) return alert('Your username must be under 25 letters and over 3.');
			if (!/https:\/\//gi.test(input.image)) return alert('Your image must be an https link.');
			if (input.about && input.about.length > 400) return alert('Your about must not be longer than 400 characters.');
			if (input.admin && !store.auth.state.user?.admin) return alert('wtf');

			input.about = input.about.replace(/\n{3}\n*/g, '\n\n');
			input.name = input.name.replace(/\n+/g, '');

			await store.user.actions.updateProfile({
				name: input.name,
				image: input.image,
				about: input.about,
				admin: input.admin,
				id: user.value.id,
			});
		}

		return {
			router,
			route,
			local,
			store,
			user,
			format,
			updateProfile,
		};
	},
});
</script>

<style lang="stylus" scoped>
.activeNav {
    --tw-border-opacity: 1
	color: nord6
}
</style>

<style lang="stylus">
.posts-enter-active,
.posts-leave-active {
	transition: all 1s ease
}
.posts-leave-to {
	opacity: 0
	margin-top: -190px
}
</style>
