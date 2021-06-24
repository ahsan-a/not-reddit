<template>
	<div class="bg" />
	<Navbar :padding="true" />
	<div class="flex w-full mx-auto xl:w-9/12 lg:w-11/12">
		<div class="w-full px-6 py-5 mx-1 mt-6 rounded-lg shadow-sm md:mx-10 lg:w-9/12 lg:mr-10 bg-nord1">
			<h1 class="text-xl font-semibold text-nord6">Admin</h1>
		</div>
		<SubredditSidebar class="hidden lg:w-1/3 lg:block xl:w-3/12" />
	</div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '@/store';

import Navbar from '@/components/Navbar.vue';
import SubredditSidebar from '@/components/SubredditSidebar.vue';

export default defineComponent({
	components: {
		Navbar,
		SubredditSidebar,
	},
	setup() {
		return {
			store,
		};
	},
});
</script>

<style lang="stylus">
.fixedCenter {
	left: 50%
	margin-right: -50%
	transform: translate(0%, -50%)
}
.posts-enter-active,
.posts-leave-active {
	transition: all 0.5s ease
}
.posts-leave-to {
	opacity: 0
	margin-top: -190px
}
</style>
