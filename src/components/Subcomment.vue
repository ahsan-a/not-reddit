<template>
	<div class="flex ml-1 border-l-2 xl:ml-3 border-nord3 bg-nord1" :class="{ 'mt-6': location !== 'user', 'pb-8': location === 'user' }">
		<div class="w-full ml-2 rounded-lg xl:ml-4">
			<div class="flex flex-row items-center justify-between">
				<router-link :to="`/u/${comment.user?.id}`" class="overflow-y-hidden cursor-default">
					<img
						:src="comment.user?.image || require('../assets/defaultPfp.webp')"
						class="hidden object-cover w-8 h-8 rounded-full cursor-pointer md:inline"
					/>
					<span class="font-semibold cursor-pointer md:ml-3 text-md text-nord6 hover:underline">{{
						comment.user?.name ?? '[deleted]'
					}}</span>
				</router-link>
				<span class="float-right text-sm font-medium text-nord6">{{ createDateText(comment.created_at?.toDate()) }}</span>
			</div>

			<vue3-markdown-it
				:source="store.createPost.actions.purify(comment.content)"
				:html="true"
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
				class="max-w-full mt-4 overflow-hidden break-words text-md text-nord4 markdownRender"
			/>

			<div class="flex flex-row mt-3 mb-2" v-if="location !== 'user'">
				<button
					class="inline px-2 py-1 transition-all rounded-md group hover:bg-nord2 text-nord4 hover:text-nord6 noOutline"
					v-if="store.auth.state.isLoggedIn"
					@click="createCommentVisible = !createCommentVisible"
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
					<span class="hidden ml-2 text-sm font-medium sm:inline">Reply</span>
				</button>
				<button
					class="inline px-2 py-1 ml-2 transition-all rounded-md group hover:bg-nord2 text-nord4 hover:text-nord6 noOutline"
					v-if="store.auth.state.user?.admin || comment.user_id === store.auth.state.user?.id"
					@click="store.post.actions.deleteComment(comment.id)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						class="inline w-5 h-auto transition-all fill-current text-nord8 group-hover:text-nord7"
						viewBox="0 0 24 24"
					>
						<path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
					</svg>
					<span class="hidden ml-2 text-sm font-medium sm:inline">Delete</span>
				</button>
			</div>
			<CreateComment v-if="createCommentVisible" :parent_id="comment.id" @hideCreateComment="createCommentVisible = false" />

			<Subcomment v-for="subcomment in comment.comments" :key="subcomment.id" :comment="subcomment" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import store from '@/store';
import { Comment } from '@/typings';
import * as timeago from 'timeago.js';

import CreateComment from './CreateComment.vue';

// @ts-ignore
import taskLists from 'markdown-it-task-lists';

export default defineComponent({
	props: {
		comment: {
			type: Object as PropType<Comment>,
		},
		location: {
			type: String as PropType<'user' | 'post'>,
		},
	},
	components: {
		CreateComment,
	},
	setup() {
		const createDateText = (date: Date) => timeago.format(date);
		const createCommentVisible = ref(false);

		return {
			store,
			createDateText,
			createCommentVisible,
			taskLists,
		};
	},
});
</script>

<style></style>
