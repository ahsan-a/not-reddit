<template>
	<div
		class="fixed z-10 p-5 mx-auto border rounded-lg shadow-lg bottom-3 right-3 w-49/50 bg-nord2 border-nord1 max-w-max text-nord5"
		v-if="!cookieAccepted"
	>
		<h1 class="text-xl font-semibold">Privacy and Guidelines</h1>
		<p
			>By using this site, you agree to follow our
			<router-link to="/about/Guidelines" class="inline text-nord8 hover:underline">Community Guidelines</router-link>
			and our
			<router-link to="/about/privacy" class="inline text-nord8 hover:underline">Privacy Policy.</router-link></p
		>
		<button class="block mt-4 button-blue" @click="acceptCookies">
			Understood
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

export default defineComponent({
	setup() {
		let cookieAccepted: Ref<string | boolean | null> = ref(localStorage.getItem('cookieAccepted'));

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
