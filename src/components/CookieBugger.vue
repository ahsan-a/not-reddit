<template>
	<div
		class="fixed bottom-3 mx-auto shadow-lg right-3 w-49/50 bg-nord2 border border-nord1 max-w-max rounded-lg p-5 text-nord5 z-10"
		v-if="!cookieAccepted"
	>
		<h1 class="text-xl font-semibold">Privacy and Guidelines</h1>
		<p
			>By using this site, you agree to follow our
			<router-link to="/about/Guidelines" class="inline text-nord8 hover:underline">Community Guidelines</router-link>
			and our
			<router-link to="/about/privacy" class="inline text-nord8 hover:underline">Privacy Policy.</router-link></p
		>
		<button class="button-blue block mt-4" @click="acceptCookies">
			Understood
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

export default defineComponent({
	setup() {
		let cookieAccepted: Ref<string | boolean | null> = ref(localStorage.getItem('cookieAccepted'));

		console.log(cookieAccepted.value);

		if (cookieAccepted.value === 'false') {
			localStorage.setItem('cookieAccepted', 'false');
			cookieAccepted.value = false;
		}

		function acceptCookies() {
			localStorage.setItem('cookieAccepted', 'true');
			cookieAccepted.value = true;
		}

		return { cookieAccepted, acceptCookies };
	},
});
</script>

<style></style>
