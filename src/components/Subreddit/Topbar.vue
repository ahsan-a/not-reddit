<template>
	<div class="w-full pt-6 mx-auto xl:w-9/12 lg:w-11/12 bg-nord0 z-2">
		<div
			class="border rounded-lg shadow-md px-9 pt-7 bg-nord1 border-nord2"
		>
			<div class="pl-3">
				<span class="text-4xl font-bold text-nord5">
					<img
						:src="
							store.subreddit.state.subreddit.image ||
								require('../../assets/defaultSub.svg')
						"
						class="inline object-cover w-10 h-10 mr-3 rounded-full"
					/>
					r/{{ store.subreddit.state.subreddit.name }}
				</span>
				<p
					class="mt-6 overflow-x-visible overflow-y-hidden break-words text-md text-nord4"
				>
					{{ store.subreddit.state.subreddit.description }}
				</p>
			</div>

			<div class="flex flex-row items-center w-full mt-5">
				<div class="flex flex-row">
					<router-link
						class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord3 hover:border-nord2 hover:border-opacity-100"
						:class="{ activeNav: local.menu === 'home' }"
						@click="local.menu = 'posts'"
						:to="`/r/${local.subreddit?.name}`"
						>r/{{ local.subreddit?.name }}</router-link
					>
					<router-link
						class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord3 hover:border-nord2 hover:border-opacity-100 "
						:class="{ activeNav: local.menu === 'create' }"
						:to="`/create/r/${local.subreddit?.name}`"
						>Create Post</router-link
					>
					<router-link
						class="px-3 pb-1 text-sm font-semibold transition-all border-b-4 border-opacity-0 cursor-pointer text-nord4 border-nord2 hover:border-nord2 hover:border-opacity-100 "
						:class="{ activeNav: local.menu === 'options' }"
						:to="`/options/r/${local.subreddit?.name}`"
						@click="local.menu = 'options'"
						v-if="
							(store.auth.state.user?.id === user?.id ||
								store.auth.state.user?.admin) &&
								store.auth.state.isLoggedIn
						"
						>Options</router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import {useRoute} from 'vue-router'
import store from '@/store'

export default defineComponent({
    setup() {
		const local = ref(store.subreddit.state);
		const route = useRoute()
		function init(name?: string) {
			document.title = `r/${name ?? route.params.name} | (not) reddit`;
			store.subreddit.actions.bindPosts(
				name || route.params.name.toString()
			);
			local.value.menu = 'home';
		}
		init();
		watch(
			() => route.params.name,
			(name) => {
				if (!name) return;
				store.subreddit.state.posts = [];
				init(name.toString());
				window.scrollTo(0, 0);
			}
		);

		return {
			store,
			local,
		};
    },
})
</script>


<style lang="stylus" scoped>
.activeNav {
    --tw-border-opacity: 1
	color: nord6
}
</style>