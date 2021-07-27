<template>
	<div class="bg" />
	<Navbar :padding="true" />

	<div class="flex w-full max-w-full mx-auto mt-6 xl:w-9/12 lg:w-11/12 xl:max-w-9/12 lg:max-w-11/12">
		<div class="w-full max-w-full mx-2 lg:w-8/12 xl:w-3/4">
			<button
				class="sticky flex flex-row items-center justify-between px-3 py-2 mx-auto mb-3 transition-all rounded-b-lg shadow-lg top-16 w-49/50 z-5 noOutline active:bg-nord3 hover:bg-nord2 group bg-nord1 border-nord2"
				@click="backButton"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="transition-all fill-current text-nord8 group-hover:text-nord7"
				>
					<path
						d="M13.427 3.021h-7.427v-3.021l-6 5.39 6 5.61v-3h7.427c3.071 0 5.561 2.356 5.561 5.427 0 3.071-2.489 5.573-5.561 5.573h-7.427v5h7.427c5.84 0 10.573-4.734 10.573-10.573s-4.733-10.406-10.573-10.406z"
					/>
				</svg>
				<h1 class="text-lg font-medium text-center text-nord5">
					Go Back
				</h1>
				<div></div>
			</button>
			<Post
				:post="store.post.state.currentPost"
				v-if="store.post.state.currentPost.deletedUser || store.post.state.currentPost.user?.id"
				location="post"
			/>
			<div
				class="flex flex-col px-5 py-5 mb-8 overflow-hidden transition-all rounded-lg shadow-md w-49/50 md:px-8 hover:shadow-xl bg-nord1 border-nord2"
				v-if="store.auth.state.isLoggedIn"
				id="comment"
			>
				<div v-if="!mdPreview">
					<h1 class="mb-5 text-3xl font-semibold text-nord6">
						Create Comment
					</h1>
					<form @submit.prevent="createComment">
						<textarea
							placeholder="Comment (Markdown)"
							class="block w-full px-5 py-3 mx-auto text-sm transition-all border-none rounded-md outline-none resize-none focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 jetbrains text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5 commentInput"
							v-model="commentInput"
							@keydown="textAreaHandler"
							ref="newCommentTextarea"
							required
						/>

						<span class="flex flex-row items-center justify-center mt-6">
							<div class="flex flex-row items-center">
								<button class="mx-3 button-blue" type="button" @click="mdPreview = true">
									Preview
								</button>
								<button class="mx-3 button-green" type="submit" id="submitCommentButton">
									Submit
								</button>
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
							<button class="mx-3 button-blue" type="button" @click="mdPreview = false">
								Hide Preview
							</button>
						</div>
					</span>
				</div>
			</div>

			<div class="max-w-full">
				<Comment v-for="comment in store.post.state.currentPost.comments" :key="comment.id" :comment="comment" />
			</div>
		</div>
		<div class="hidden lg:w-4/12 lg:block xl:w-1/4 lg:min-w-4/12 xl:min-w-1/4">
			<div class="sticky overflow-y-auto max-h-90vh top-16" id="sidebar">
				<SubredditSidebar />
				<InfoSidebar />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import Post from '@/components/Post.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import InfoSidebar from '@/components/InfoSidebar.vue';
import Comment from '@/components/Comment.vue';

export default defineComponent({
	components: {
		Navbar,
		Post,
		SubredditSidebar,
		Comment,
		InfoSidebar,
	},
	setup() {
		const route = useRoute();
		const router = useRouter();

		const newCommentTextarea: Ref<HTMLTextAreaElement | null> = ref(null);
		store.post.actions.getPost(route.params.id.toString(), true, true);

		const commentInput = ref('');
		const mdPreview = ref(false);

		onMounted(() => {
			window.scrollTo(0, 0);
		});

		watch(commentInput, () => {
			if (!newCommentTextarea.value) return;
			newCommentTextarea.value.style.height = 'auto';
			newCommentTextarea.value.style.height = `${newCommentTextarea.value.scrollHeight}px`;
		});

		// minimise this
		function textAreaHandler(e: KeyboardEvent) {
			if (!newCommentTextarea.value) return;
			let contentArr = [...newCommentTextarea.value.value];

			const delimiters: any = {
				//let's me use [] without writing a type
				always: {
					'"': '"',
					'(': ')',
					'{': '}',
					'[': ']',
					'<': '>',
					'`': '`',
				},
				nextToWhitespace: {
					"'": "'",
					_: '_',
					'*': '*',
					'~': '~',
				},
			};

			const ctrlChars: any = {
				b: '**',
				i: '_',
			};

			const cursorStart = newCommentTextarea.value.selectionStart;
			const cursorEnd = newCommentTextarea.value.selectionEnd;

			// handle selection delimiters
			if (cursorStart !== cursorEnd) {
				if (e.key === 'Backspace') return;

				if (e.ctrlKey && e.key in ctrlChars) {
					e.preventDefault();
					contentArr.splice(cursorStart, 0, ctrlChars[e.key]);
					contentArr.splice(cursorEnd + 1, 0, ctrlChars[e.key]);
					newCommentTextarea.value.value = contentArr.join('');
					newCommentTextarea.value.selectionStart = cursorStart;
					newCommentTextarea.value.selectionEnd = cursorEnd + ctrlChars[e.key].length * 2;
					return;
				}

				if (!(e.key in delimiters.always || e.key in delimiters.nextToWhitespace)) return;
				e.preventDefault();
				const delimiter1 = delimiters.always[e.key] || delimiters.nextToWhitespace[e.key];

				contentArr.splice(cursorStart, 0, e.key);
				contentArr.splice(cursorEnd + 1, 0, delimiter1);
				newCommentTextarea.value.value = contentArr.join('');

				newCommentTextarea.value.selectionStart = cursorStart;
				newCommentTextarea.value.selectionEnd = cursorEnd + 2;

				return;
			}

			// handle regular delimiters
			if (e.key === 'Backspace') {
				if (
					!(
						(contentArr[cursorStart] in delimiters.always || contentArr[cursorStart] in delimiters.nextToWhitespace) &&
						(contentArr[cursorStart - 1] in delimiters.always || contentArr[cursorStart - 1] in delimiters.nextToWhitespace)
					)
				)
					return;
				contentArr.splice(cursorStart, 1);
			} else if (e.ctrlKey && e.key in ctrlChars) {
				e.preventDefault();
				contentArr.splice(cursorStart, 0, ctrlChars[e.key] + ctrlChars[e.key]);
				newCommentTextarea.value.value = contentArr.join('');
				newCommentTextarea.value.selectionStart = cursorStart + ctrlChars[e.key].length;
				newCommentTextarea.value.selectionEnd = cursorStart + ctrlChars[e.key].length;
				return;
			} else if (e.key in delimiters.always) {
				contentArr.splice(cursorStart, 0, delimiters.always[e.key]);
			} else if (e.key in delimiters.nextToWhitespace) {
				if (/^\S$/g.test(contentArr[cursorStart - 1])) return;
				contentArr.splice(cursorStart, 0, delimiters.nextToWhitespace[e.key]);
			} else return;

			newCommentTextarea.value.value = contentArr.join('');
			newCommentTextarea.value.selectionEnd = cursorStart;
			newCommentTextarea.value.selectionStart = cursorStart;
		}

		async function createComment() {
			if (!commentInput.value.replace(/\s+/g, '').length) return alert('Your comment must not be empty.');

			const button = document.getElementById('submitCommentButton') as HTMLButtonElement;

			button.disabled = true;

			await store.post.actions.createComment({
				content: commentInput.value,
				post_id: store.post.state.currentPost.id || '',
				parent_id: null,
				subreddit_id: store.post.state.currentPost.subreddit_id || '',
				user_id: store.auth.state.user?.id || '',
			});

			button.disabled = false;
			commentInput.value = '';
		}

		function backButton() {
			if (window.history.state.back) router.go(-1);
			else
				router.push({
					path: `/r/${route.params.subreddit.toString()}`,
				});
		}

		return {
			route,
			router,
			store,
			textAreaHandler,
			commentInput,
			newCommentTextarea,
			mdPreview,
			backButton,
			createComment,
		};
	},
});
</script>

<style lang="stylus">
@import '../assets/markdown.styl';
.commentInput {
	max-height: 400px
}
</style>
