<template>
	<FullMDEditor v-if="store.createPost.state.fullscreen" />
	<div class="bg -z-10" />
	<Navbar :padding="true" />
	<div class="flex w-full pt-6 mx-auto xl:w-5/6 2xl:w-2/3 lg:w-11/12">
		<div
			class="w-full px-6 py-5 mx-1 border rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1 border-nord2"
			v-if="!store.auth.state.isLoggedIn"
		>
			<h1 class="text-3xl font-bold text-center text-nord6">You must be logged in to create a post.</h1>
			<router-link to="/login" class="block w-full mx-auto mt-8 text-xl font-semibold text-center underline text-nord8">Log In</router-link>
		</div>

		<div
			class="w-full px-6 py-5 mx-1 mt-6 border rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1 border-nord2"
			v-else-if="!local.mdPreview"
		>
			<h1 class="text-2xl font-bold text-center text-nord6">Create a Post</h1>
			<form @submit.prevent="createPost" class="w-full">
				<h2 class="mt-4 mb-3 text-lg font-semibold text-nord5">Subreddit <span class="text-red-500">*</span></h2>
				<div class="flex flex-row items-center">
					<img
						:src="local.subreddit?.image || require('../assets/defaultSub.svg')"
						class="object-cover w-10 h-10 mr-3 rounded-full"
						v-if="postInput.subreddit"
					/>

					<Multiselect
						v-model="postInput.subreddit"
						v-if="subreddits.length"
						:searchable="true"
						class="w-full"
						:options="subreddits.map((x) => `r/${x.name}`)"
					/>
				</div>
				<h2 class="mt-6 mb-2 text-lg font-semibold text-nord5">Title <span class="text-red-500">*</span></h2>
				<input
					type="text"
					placeholder="Post Title"
					class="block w-full px-5 mx-auto mt-2 mb-4 font-semibold transition-all border-none rounded-md shadow-sm outline-none h-11 text-md focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
					maxlength="100"
					required
					v-model="postInput.title"
					title="Required"
				/>
				<h2 class="mt-6 mb-4 text-lg font-semibold text-nord5"
					>Body
					<button
						v-if="true"
						class="flex-row items-center hidden float-right p-2 text-sm font-semibold transition-all rounded-md xl:flex active:bg-nord3 noOutline ml-text-nord2 group hover:bg-nord2"
						type="button"
						@click="store.createPost.state.fullscreen = true"
					>
						Open Full Screen Editor
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="w-5 h-auto ml-3 transition-all fill-current text-nord8 group-hover:text-nord7"
						>
							<path
								d="M24 0v10.999l-3.379-3.378-4.379 4.379-4.242-4.242 4.379-4.379-3.379-3.379h11zm-11.875 16.138l-4.242-4.242-4.504 4.483-3.379-3.378v10.999h11l-3.379-3.379 4.504-4.483z"
							/>
						</svg>
					</button>
				</h2>
				<textarea
					placeholder="Body (Markdown)"
					class="block w-full h-24 px-5 py-3 mx-auto mt-2 text-sm transition-all border-none rounded-md outline-none resize-none focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 jetbrains text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
					style="max-height: 500px"
					v-model="postInput.content"
					title="Required"
					@keydown="textAreaHandler"
					ref="mdEditor"
				/>
				<span class="flex flex-row items-center justify-center mt-6">
					<div class="flex flex-row items-center">
						<button class="mx-3 button-blue" type="button" @click="local.mdPreview = true">Preview</button>
						<button class="mx-3 button-green" type="submit" id="submitPost">Submit</button>
					</div>
				</span>
			</form>
		</div>

		<div class="mx-1 mt-6 md:mx-10 lg:w-9/12 lg:mr-10" v-else>
			<div class="w-full px-6 py-5 border rounded-lg shadow-sm bg-nord1 border-nord2">
				<h1 class="mb-4 overflow-hidden text-3xl font-bold break-words md:text-4xl lh50 text-nord6">{{ postInput.title }}</h1>
				<vue3-markdown-it
					:source="store.createPost.actions.purify(postInput.content)"
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
					class="max-w-full overflow-hidden break-words markdownRender text-nord5"
					:plugins="[
						{
							plugin: taskLists,
							options: { enabled: true },
						},
					]"
				/>

				<span class="flex flex-row items-center justify-center mt-6">
					<div class="flex flex-row items-center">
						<button class="mx-3 button-blue" type="button" @click="local.mdPreview = false">Hide Preview</button>
					</div>
				</span>
			</div>
		</div>

		<SubredditSidebar class="hidden w-full lg:w-3/12 lg:block" />
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, toRefs, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Subreddit } from '@/typings';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';
import Multiselect from '@vueform/multiselect';
import FullMDEditor from '@/components/FullMDEditor.vue';

// @ts-ignore
import taskLists from 'markdown-it-task-lists';

export default defineComponent({
	components: {
		Navbar,
		SubredditSidebar,
		Multiselect,
		FullMDEditor,
	},
	setup() {
		document.title = 'create a post | (not) reddit';
		const router = useRouter();
		const mdEditor: Ref<HTMLTextAreaElement | null> = ref(null);

		const local: { subreddit: Subreddit | null } = reactive({
			subreddit: null,
			mdPreview: false,
		});

		const postInput = toRefs(store.createPost.state).newPost;

		const { subreddits } = toRefs(store.subreddits.state);

		function getSubFromParams() {
			if (subreddits.value.some((x) => x.name.toLowerCase() === router.currentRoute.value.params.subreddit.toString().toLowerCase())) {
				postInput.value.subreddit = `r/${
					subreddits.value.find((x) => x.name.toLowerCase() === router.currentRoute.value.params.subreddit.toString().toLowerCase())?.name
				}`;
			}
		}

		const subredditName = toRefs(postInput.value).subreddit;

		onMounted(() => {
			if (!subreddits.value.length) watch(subreddits, getSubFromParams, { immediate: true });
			else getSubFromParams();

			watch(subredditName, () => {
				if (!postInput.value.subreddit) return;
				local.subreddit =
					store.subreddits.state.subreddits.find(
						(x) => x.name.toLowerCase() === postInput.value.subreddit.toLowerCase().replace(/r\//g, '')
					) ?? store.subreddits.state.subreddits[0];
			});

			watch(toRefs(postInput.value).content, () => {
				if (!mdEditor.value) return;
				mdEditor.value.style.height = 'auto';
				mdEditor.value.style.height = `${mdEditor.value.scrollHeight}px`;
			});
		});

		// minimise this
		function textAreaHandler(e: KeyboardEvent) {
			if (!mdEditor.value) return;
			let contentArr = [...mdEditor.value.value];

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

			const cursorStart = mdEditor.value.selectionStart;
			const cursorEnd = mdEditor.value.selectionEnd;

			// handle selection delimiters
			if (cursorStart !== cursorEnd) {
				if (e.key === 'Backspace') return;

				if (e.ctrlKey && e.key in ctrlChars) {
					e.preventDefault();
					contentArr.splice(cursorStart, 0, ctrlChars[e.key]);
					contentArr.splice(cursorEnd + 1, 0, ctrlChars[e.key]);
					mdEditor.value.value = contentArr.join('');
					mdEditor.value.selectionStart = cursorStart;
					mdEditor.value.selectionEnd = cursorEnd + ctrlChars[e.key].length * 2;
					return;
				}

				if (!(e.key in delimiters.always || e.key in delimiters.nextToWhitespace)) return;
				e.preventDefault();
				const delimiter1 = delimiters.always[e.key] || delimiters.nextToWhitespace[e.key];

				contentArr.splice(cursorStart, 0, e.key);
				contentArr.splice(cursorEnd + 1, 0, delimiter1);
				mdEditor.value.value = contentArr.join('');

				mdEditor.value.selectionStart = cursorStart;
				mdEditor.value.selectionEnd = cursorEnd + 2;

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
				mdEditor.value.value = contentArr.join('');
				mdEditor.value.selectionStart = cursorStart + ctrlChars[e.key].length;
				mdEditor.value.selectionEnd = cursorStart + ctrlChars[e.key].length;
				return;
			} else if (e.key in delimiters.always) {
				contentArr.splice(cursorStart, 0, delimiters.always[e.key]);
			} else if (e.key in delimiters.nextToWhitespace) {
				if (/^\S$/g.test(contentArr[cursorStart - 1])) return;
				contentArr.splice(cursorStart, 0, delimiters.nextToWhitespace[e.key]);
			} else return;

			mdEditor.value.value = contentArr.join('');
			mdEditor.value.selectionEnd = cursorStart;
			mdEditor.value.selectionStart = cursorStart;
		}
		// lol

		async function createPost() {
			if (!store.auth.state.isLoggedIn) return;
			if (!postInput.value.title.length) return alert('A title is required.');
			const subreddit = store.subreddits.state.subreddits.find(
				(x) => x.name.toLowerCase() === postInput.value.subreddit.toLowerCase().replace('r/', '')
			);

			if (!subreddit) return alert("This subreddit doesn't exist or could not be found.");

			const submitButton = document.getElementById('submitPost') as HTMLButtonElement;
			submitButton.disabled = true;

			const res = await store.createPost.actions.createPost({
				title: postInput.value.title,
				content: store.createPost.actions.purify(postInput.value.content),
				subreddit_id: subreddit.id,
				user_id: store.auth.state.user?.id,
			});

			submitButton.disabled = false;

			if (res) {
				let subredditToPush = postInput.value.subreddit;
				postInput.value = {
					title: '',
					subreddit: 'r/General',
					content: '',
				};
				router.push({ path: `/${subredditToPush}` });
			}
		}

		return {
			store,
			router,
			postInput,
			subreddits,
			local,
			textAreaHandler,
			mdEditor,
			createPost,
			taskLists,
		};
	},
});
</script>

<style lang="stylus">
@import '../assets/dropdownStyles.styl';
@import '../assets/styles.styl';
</style>
