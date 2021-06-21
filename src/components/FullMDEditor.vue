<template>
	<div class="fixed z-20 hidden w-screen h-screen px-5 pt-5 border shadow-md border-nord2 rounded-xl bg-nord1 xl:block">
		<span class="flex items-center justify-between w-full rounded-t-xl">
			<h1 class="text-2xl font-semibold text-nord6">Markdown Editor</h1>
			<button @click="store.createPost.state.fullscreen = false" class="noOutline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="p-1 transition-all rounded-full fill-current bg-nord11 text-nord5 hover:bg-nord12"
				>
					<path
						d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z"
					/>
				</svg>
			</button>
		</span>
		<div class="flex flex-row justify-between w-full h-full mt-5">
			<div class="w-1/2 h-full border-r border-nord0 mdEditor">
				<h1 class="mb-3 text-xl font-semibold text-nord5">Markdown</h1>
				<textarea
					placeholder="Body (Markdown)"
					class="block w-11/12 px-5 py-3 mx-auto mt-2 text-sm transition-all border-none rounded-md outline-none resize-none h-5/6 focus:outline-none focus:border-none bg-nord2 focus:bg-nord3 jetbrains text-nord6 focus:shadow-md placeholder-nord4 focus:placeholder-nord5"
					v-model="store.createPost.state.newPost.content"
					title="Required"
					@keydown="textAreaHandler"
					ref="mdEditor"
				/>
			</div>
			<div class="w-1/2 h-full" ref="mdPreview">
				<div class="ml-5 h-5/6 mdPreview">
					<h1 class="mb-3 text-xl font-semibold text-nord5">Preview</h1>
					<vue3-markdown-it
						:source="store.createPost.actions.purifyWithPatch(store.createPost.state.newPost.content)"
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
						class="w-11/12 h-full px-3 mx-auto overflow-x-hidden overflow-y-scroll break-words text-nord5 postContent"
						id="mdPreview"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, Ref, onMounted } from 'vue';

	import store from '@/store';
	export default defineComponent({
		setup() {
			const mdEditor: Ref<HTMLTextAreaElement | null> = ref(null);

			onMounted(() => {
				mdEditor.value?.addEventListener('scroll', () => {
					if (!mdEditor.value) return;
					const mdPreview = document.getElementById('mdPreview');
					if (mdPreview) mdPreview.scrollTop = mdEditor.value.scrollTop;
				});
			});

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

					if (e.ctrlKey) {
						if (!(e.key in ctrlChars)) return;

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
				} else if (e.ctrlKey) {
					if (!(e.key in ctrlChars)) return;
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

			return {
				store,
				mdEditor,
				textAreaHandler,
			};
		},
	});
</script>

<style lang="stylus">
	@import '../assets/post.styl';

	::-webkit-scrollbar {
		width: 10px;
	}
	.mdEditor {
		::-webkit-scrollbar-track {
			background: nord2
		}
		::-webkit-scrollbar-thumb {
			background: nord3
			border-radius: 10px;
		}
			::-webkit-scrollbar-thumb:hover {
			background: nord7;
			}
	}

	.mdPreview {
		::-webkit-scrollbar-track {
			background: nord1
		}
		::-webkit-scrollbar-thumb {
			background: nord2
			border-radius: 10px;
		}
		::-webkit-scrollbar-thumb:hover {
			background: nord7;
		}
	}
</style>
