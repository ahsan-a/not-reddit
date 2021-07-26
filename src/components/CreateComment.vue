<template>
	<div
		class="flex flex-col w-full px-2 py-3 mb-8 overflow-hidden transition-all border rounded-lg md:p-8 bg-nord1 border-nord2"
		v-if="store.auth.state.isLoggedIn"
	>
		<div v-if="!mdPreview">
			<h1 class="w-full mb-2 text-2xl font-semibold text-center md:mb-5 text-nord6 md:text-left">
				Create Comment
			</h1>
			<form @submit.prevent="createComment">
				<textarea
					placeholder="Comment (Markdown)"
					class="block w-full px-2 py-3 mx-auto text-sm transition-all border-none rounded-md outline-none resize-none md:px-5 focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 jetbrains text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5 commentInput"
					v-model="commentInput"
					ref="newCommentTextarea"
					required
				/>

				<span class="flex flex-row items-center justify-center mt-6">
					<div class="flex flex-row items-center">
						<button class="hidden mx-3 button-blue sm:block" type="button" @click="mdPreview = true">Preview</button>
						<button class="mx-3 button-green" type="submit">Submit</button>
					</div>
				</span>
			</form>
		</div>
		<div v-else>
			<h1 class="mb-5 text-3xl font-semibold text-nord6">
				Markdown Preview
			</h1>
			<div
				v-html="store.createPost.actions.purify(commentInput)"
				class="max-w-full overflow-hidden text-sm break-words text-nord5 markdownRender"
			/>

			<span class="flex flex-row items-center justify-center mt-6">
				<div class="flex flex-row items-center">
					<button class="mx-3 button-blue" type="button" @click="mdPreview = false">Hide Preview</button>
				</div>
			</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import store from '@/store';

// @ts-ignore
import taskLists from 'markdown-it-task-lists';

export default defineComponent({
	props: {
		parent_id: {
			type: String,
			required: true,
		},
	},
	setup(props, { emit }) {
		const mdPreview = ref(false);
		const commentInput = ref('');
		onMounted(() => window.scrollBy(0, 250));

		async function createComment() {
			if (!commentInput.value.replace(/\s+/g, '').length) return alert('Your comment must not be empty.');

			await store.post.actions.createComment({
				content: commentInput.value,
				post_id: store.post.state.currentPost.id || '',
				parent_id: props.parent_id,
				subreddit_id: store.post.state.currentPost.subreddit_id || '',
				user_id: store.auth.state.user?.id || '',
			});
			commentInput.value = '';
			emit('hideCreateComment');
		}

		return {
			store,
			mdPreview,
			commentInput,
			createComment,
			taskLists,
		};
	},
});
</script>

<style></style>
