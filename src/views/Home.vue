<template>
	<div class="h-screen bg-nord0">
		<img src="../assets/logo.png" class="z-0 h-auto mainLogo md:w-64" />
		<Navbar />
		<div class="container flex flex-col flex-wrap items-center px-6 pt-24 mx-auto md:pt-48 md:flex-row z-1">
			<div class="flex flex-col justify-center w-full overflow-y-hidden xl:w-2/5 lg:items-start">
				<h1 class="my-4 text-3xl font-bold leading-tight text-center md:text-5xl text-nord4 md:text-left">
					This isn't Reddit.
				</h1>
				<p class="mb-8 text-base leading-normal text-center md:text-2xl md:text-left text-nord4">
					Please don't file a cease and desist letter.
				</p>

				<p class="pb-8 font-bold text-center lg:pb-6 md:text-left fade-in text-nord4">
					Built with
					<a href="https://v3.vuejs.org/" class="text-nord8">Vue.js</a>,
					<a href="https://tailwindcss.com/" class="text-nord8">Tailwind</a>
					and
					<a href="https://firebase.google.com/" class="text-nord8">Firebase</a>.
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import Navbar from '@/components/Navbar.vue';

	export default defineComponent({
		components: {
			Navbar,
		},
	});
</script>

<style lang="stylus" scoped>
	.mainLogo {
		position: absolute
		left: 50%
		right: -50%
		top: 50%
		transform: translate(-50%, -50%)
		@media screen and (max-width: 768px){
			transform: translate(-50%, 0%)
		}
	}
</style>
