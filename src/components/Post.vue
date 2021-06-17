<template>
	<div
		class="flex flex-col w-full px-5 pt-5 my-5 overflow-hidden transition-all border rounded-lg shadow-md md:px-8 hover:shadow-xl bg-nord1 border-nord2 text-nord4 hover:text-nord5"
	>
		<div class="flex flex-row items-stretch justify-between w-full mb-5">
			<div class="flex flex-row items-end">
				<h1 class="overflow-hidden text-4xl font-bold break-words text-nord6">{{ post.title }}</h1>
			</div>
			<div class="float-right w-auto ml-10 justify-self-end min-w-max">
				<span class="font-medium text-nord6">{{ post.user.name }}</span>
				<img
					:src="post.user.image || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'"
					class="inline h-auto ml-4 rounded-full w-9"
				/>
			</div>
		</div>
		<vue3-markdown-it
			:source="post.content"
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
			class="overflow-hidden postContent"
		/>
		<div class="mt-10 mb-3">
			<router-link
				:to="`${route.fullPath}/${post.id}`"
				class="inline px-2 py-1 pb-2 transition-all rounded-md group hover:bg-nord2 text-nord4 hover:text-nord6"
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
				class="inline px-2 py-1 ml-4 transition-all rounded-md hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
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
						d="M17.026 22.957c10.957-11.421-2.326-20.865-10.384-13.309l2.464 2.352h-9.106v-8.947l2.232 2.229c14.794-13.203 31.51 7.051 14.794 17.675z"
					/>
				</svg>
				<span class="ml-2 text-sm font-medium">Share</span>
			</button>

			<button
				class="inline px-2 py-1 ml-4 transition-all rounded-md hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
				v-if="(store.auth.state.user.isLoggedIn && store.auth.state.user.admin) || post.user_id === store.auth.state.user.id"
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
			<span class="inline float-right pt-1.5 text-sm transition-all rounded-md text-nord5">{{ createDateText(post.created_at.toDate()) }}</span>
		</div>

		<div class="flex flex-row items-center mb-6 just" v-if="shareEnabled">
			<input
				type="text"
				:value="`https://not-reddit.vercel.app${route.fullPath}/${post.id}`"
				class="w-full px-3 py-2 mx-auto rounded-md shadow-sm bg-nord2 text-nord4 focus:text-nord5 noOutline shareinput"
				readonly
			/>
			<button
				class="inline float-right px-2 py-1 ml-6 transition-all rounded-md min-w-max hover:bg-nord2 text-nord4 hover:text-nord6 group noOutline"
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
	import { useRoute } from 'vue-router';
	import { Post } from '@/typings';
	import * as timeago from 'timeago.js';
	import store from '@/store';

	export default defineComponent({
		props: {
			post: {
				type: Object as PropType<Post>,
				required: true,
			},
		},
		setup(props) {
			const route = useRoute();
			const shareEnabled = ref(false);

			function createDateText(date: Date) {
				return timeago.format(date);
			}

			return {
				route,
				props,
				createDateText,
				shareEnabled,
				store,
			};
		},
	});
</script>

<style lang="stylus">
	@import '../assets/styles.styl';
	.shareinput::selection {
		background-color: nord9
	}

	.postContent {
		font-size: 15px
		display: -webkit-box;
		-webkit-line-clamp: 15;
		-webkit-box-orient: vertical;
		max-height: 940px

		h1 {
			margin: 15px 0px
			font-size: 32px
			font-weight: 500
		}
		h2 {
			margin: 15px 0px
			font-size: 24px
			font-weight: 500
		}
		h3 {
			margin: 15px 0px
			font-size: 18.72px
			font-weight: 500
		}
		h4 {
			margin: 15px 0px
			font-size: 16px
			font-weight: 500
		}
		h5 {
			margin: 15px 0px
			font-size: 13.28px
			font-weight: 500
		}
		h6 {
			margin: 15px 0px
			font-size: 10.72px
			font-weight: 500
		}
		blockquote {
			border-left: 2px solid nord3
			padding-left: 20px
		}
		ul {
			list-style: inside
			padding-left: 20px
			margin-bottom: 10px
		}

		ol {
			list-style: decimal
			padding-left: 20px
		}
		li::marker {
			font-weight: 600
		}
		table {
			width: 100%
			margin: 15px 0px
		}
		th {
			border: 2px solid nord0
			padding: 5px 15px
		}
		td {
			border: 2px solid nord0
			padding: 5px 15px
		}
		a {
			color: nord8
			&:visited {
				color: nord7
			}
		}
		img {
			max-width: 300px
			margin: 20px auto
		}
		mark {
			background-color: nord9
			padding: 0px 10px
		}
		dd {
			padding: 0px 30px
		}
	}
</style>
