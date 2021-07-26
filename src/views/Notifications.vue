<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm md:mx-5 lg:w-9/12 bg-nord1">
			<h1 class="text-2xl font-bold text-nord6">Notifications</h1>
			<div class="mt-5" v-if="store.notifications.state.notifications.length">
				<div v-for="(notif, i) in store.notifications.state.notifications" :key="notif.id">
					<div
						class="px-4 transition duration-150 ease-out border-t border-l border-r text-nord6 border-nord0 hover:bg-nord2"
						:class="{
							border: store.notifications.state.notifications.length <= 1,
							'border-b': store.notifications.state.notifications.length - 1 === i,
							'rounded-t-lg': i === 0,
							'rounded-b-lg': store.notifications.state.notifications.length - 1 === i,
							'bg-nord2': notif.unread,
							'hover:bg-nord3': notif.unread,
							'opacity-80': !notif.unread,
							'hover:opacity-90': !notif.unread,
						}"
					>
						<div class="flex flex-row items-center justify-between">
							<div class="flex items-center w-11/12 py-3 cursor-pointer" @click="handleNotifClick(notif)">
								<router-link
									v-if="notif.type === 'interaction' && notif.sender?.image"
									class="mr-4 rounded-full w-9 h-9"
									:to="`/u/${notif.sender.id}`"
								>
									<tip :label="`View ${notif.sender.name}`">
										<img :src="notif.sender?.image" class="object-cover rounded-full w-9 h-9" />
									</tip>
								</router-link>
								<div>
									<h1 class="text-base font-semibold break-words description">
										{{ notif.title }}
									</h1>
									<div class="mt-0.5 text-sm">
										{{ notif.body }}
									</div>
								</div>
							</div>
							<div class="flex flex-row items-center py-3">
								<tip label="Delete">
									<button class="focus:outline-none" @click="store.notifications.actions.deleteNotification(notif.id)">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="transition fill-current text-nord8 hover:text-nord7"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
										</svg>
									</button>
								</tip>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-5" v-else>
				<img src="../assets/images/win10.webp" alt="" />
				<h1 class="mt-3 text-lg font-semibold text-center text-nord4">All caught up!</h1>
			</div>
		</div>
		<SubredditSidebar class="hidden lg:w-1/3 lg:block xl:w-3/12" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { useRouter } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';

import { Notification } from '@/typings';

export default defineComponent({
	components: {
		Navbar,
		SubredditSidebar,
	},
	setup() {
		document.title = 'Notifications | (not) reddit';
		const router = useRouter();
		store.notifications.state.newNotifs = false;

		function handleNotifClick(notif: Notification) {
			if (!notif.url?.length) return;
			router.push(notif.url);
		}
		return {
			store,
			router,
			handleNotifClick,
		};
	},
});
</script>

<style lang="stylus"></style>
