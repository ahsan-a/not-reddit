<template>
	<div
		class="flex flex-col w-full px-5 pt-5 mb-8 overflow-hidden transition-all rounded-lg shadow-md md:px-8 hover:shadow-xl bg-nord1 border-nord2 text-nord4 hover:text-nord5"
	>
		<div class="flex flex-row items-stretch justify-between w-full mb-5">
			<div class="flex flex-row items-end titleMaxW ">
				<h1 class="overflow-hidden text-3xl font-bold break-words md:text-4xl lh50 text-nord6">{{ post.title }}</h1>
			</div>
			<div class="float-right w-auto ml-1 md:ml-10 justify-self-end min-w-max" v-if="location === 'home'">
				<router-link :to="`/r/${subreddit.name}`" class="inline font-medium text-nord6 hover:underline">r/{{ subreddit.name }}</router-link>
				<router-link :to="`/r/${subreddit.name}`">
					<img
						:src="subreddit.image || require('../assets/defaultSub.svg')"
						class="hidden object-cover ml-2 rounded-full sm:inline md:ml-4 h-9 w-9"
					/>
				</router-link>
			</div>
			<div class="float-right w-auto ml-1 md:ml-10 justify-self-end min-w-max" v-else>
				<span class="font-medium text-nord6">{{ post.deletedUser ? '[deleted]' : post.user?.name }}</span>
				<img :src="post.user?.image || require('../assets/defaultPfp.webp')" class="inline ml-2 rounded-full md:ml-4 obejct-cover h-9 w-9" />
			</div>
		</div>
		<vue3-markdown-it
			:source="post.content"
			:html="false"
			:breaks="true"
			:linkify="true"
			:emoji="{
				shortcuts: {
					angry: [],
					blush: [],
					broken_heart: [],
					confused: [],
					cry: [],
					frowning: [],
					heart: [],
					imp: [],
					innocent: [],
					joy: [],
					kissing: [],
					laughing: [],
					neutral_face: [],
					open_mouth: [],
					rage: [],
					smile: [],
					smiley: [],
					smiling_imp: [],
					sob: [],
					stuck_out_tongue: [],
					sunglasses: [],
					sweat: [],
					sweat_smile: [],
					unamused: [],
					wink: [],
				},
			}"
			:plugins="[
				{
					plugin: taskLists,
					options: { enabled: true },
				},
			]"
			class="max-w-full overflow-hidden break-words markdownRender"
			:class="{ postClipped: location !== 'post' }"
		/>
		<div class="mt-10 mb-3">
			<router-link
				:to="`/r/${subreddit.name}/${post.id}`"
				class="inline px-2 py-1 pb-2 transition-all rounded-md group hover:bg-nord2 text-nord4 hover:text-nord6"
				v-if="location !== 'post'"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
				>
					<path d="M18 0h6v6h-6v-6zm-18 24h16v-24h-16v24zm18-9h6v-6h-6v6zm0 9h6v-6h-6v6z" />
				</svg>
				<span class="ml-2 text-sm font-medium">View</span>
			</router-link>
			<router-link
				:to="`/r/${subreddit.name}/${post.id}#comments`"
				class="hidden px-2 py-1 pb-2 mx-2 transition-all rounded-md md:mx-4 sm:inline group hover:bg-nord2 text-nord4 hover:text-nord6"
				v-if="location !== 'post'"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					class="inline w-6 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
					viewBox="0 0 24 24"
				>
					<path
						d="M20 9.352c0-4.852-4.75-8.352-10-8.352-5.281 0-10 3.527-10 8.352 0 1.71.615 3.39 1.705 4.695.047 1.527-.85 3.719-1.66 5.312 2.168-.391 5.252-1.258 6.648-2.115 7.698 1.877 13.307-2.842 13.307-7.892zm-14.5 1.381c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25zm4.5 0c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25zm4.5 0c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25zm7.036 1.441c-.161.488-.361.961-.601 1.416 1.677 1.262 2.257 3.226.464 5.365-.021.745-.049 1.049.138 1.865-.892-.307-.979-.392-1.665-.813-2.127.519-4.265.696-6.089-.855-.562.159-1.145.278-1.74.364 1.513 1.877 4.298 2.897 7.577 2.1.914.561 2.933 1.127 4.352 1.385-.53-1.045-1.117-2.479-1.088-3.479 1.755-2.098 1.543-5.436-1.348-7.348z"
					/>
				</svg>
				<span class="ml-2 text-sm font-medium">Comment</span>
			</router-link>

			<button
				class="hidden px-2 py-1 transition-all rounded-md sm:inline hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
				@click="shareEnabled = !shareEnabled"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
				>
					<path
						d="M5 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm11.122 12.065c-.073.301-.122.611-.122.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.943 1.764l5.488 2.927zm7.878-15.065c0-2.209-1.791-4-4-4s-4 1.791-4 4c0 .324.049.634.122.935l-5.488 2.927c.395.535.713 1.127.943 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4z"
					/>
				</svg>
				<span class="ml-3 text-sm font-medium">Share</span>
			</button>

			<button
				class="inline px-2 py-1 ml-2 transition-all rounded-md md:ml-4 hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
				v-if="store.auth.state.user.admin || post.user_id === store.auth.state.user.id"
				@click="deletePost()"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
				>
					<path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
				</svg>

				<span class="ml-2 text-sm font-medium">Delete</span>
			</button>
			<span class="float-right pt-1.5 text-sm text-nord5 sm:ml-1.5">
				<span class="hidden sm:inline"
					>{{ createDateText(post.created_at?.toDate()) }} {{ location === 'home' ? 'by ' : location === 'post' ? 'on ' : '' }}</span
				>
				<span class="ml-0.5 font-semibold" v-if="location === 'home'">{{ post.deletedUser ? '[deleted]' : post.user?.name }}</span>
				<router-link class="ml-0.5 font-semibold hover:underline" :to="`/r/${subreddit?.name}`" v-if="location === 'post'"
					>r/{{ subreddit?.name }}</router-link
				>
			</span>
		</div>

		<div class="flex flex-row items-center mb-6 just" v-if="shareEnabled">
			<input
				type="text"
				:value="`https://not-reddit.vercel.app/r/${subreddit.name}/${post.id}`"
				class="w-full px-3 py-2 mx-auto rounded-md shadow-sm bg-nord2 text-nord4 focus:text-nord5 noOutline shareinput"
				readonly
			/>
			<button
				class="inline float-right px-2 py-1 ml-6 transition-all rounded-md min-w-max noOutline hover:bg-nord2 text-nord4 hover:text-nord6 group"
				@click="shareEnabled = !shareEnabled"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
				>
					<path
						d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
					/>
				</svg>
				<span class="ml-2 text-sm font-medium">Close</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Post } from '@/typings';
import * as timeago from 'timeago.js';
import store from '@/store';

// @ts-ignore
import taskLists from 'markdown-it-task-lists';

export default defineComponent({
	props: {
		post: {
			type: Object as PropType<Post>,
			required: true,
		},
		location: {
			type: String,
		},
		fullDate: {
			type: Boolean,
		},
	},
	setup(props) {
		const route = useRoute();
		const router = useRouter();
		const shareEnabled = ref(false);

		const subreddit = ref(store.subreddits.state.subreddits.find((x) => x.id === props.post.subreddit_id));

		const createDateText = (date: Date) => timeago.format(date);

		async function deletePost() {
			await store.post.actions.deletePost(props.post.id);
			if (props.location === 'post') router.push({ path: `/r/${subreddit.value?.name}` });
		}

		return {
			route,
			props,
			createDateText,
			shareEnabled,
			store,
			deletePost,
			subreddit,
			taskLists,
		};
	},
});
</script>

<style lang="stylus" scoped>
.lh50 {
	line-height: 50px
}
.titleMaxW {
	max-width: 80%
}
</style>

<style lang="stylus">
@import '../assets/styles.styl';
@import '../assets/markdown.styl';
.shareinput::selection {
	background-color: nord9
}
.postClipped {
	@media (max-width: 1023px) {
		max-height: 400px
	}
	@media (min-width: 1024px) {
		display: -webkit-box;
		-webkit-line-clamp: 15;
		-webkit-box-orient: vertical;
	}
}
</style>
