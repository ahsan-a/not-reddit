<template>
	<Navbar />
	<img src="../assets/logo.png" class="mainLogo md:w-64 h-auto" />
	<div class="w-screen h-screen bg-nord0">
		<div class="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
			<div class="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
				<h1 class="my-4 text-3xl md:text-5xl text-nord4 font-bold leading-tight text-center md:text-left">
					This isn't Reddit.
				</h1>
				<p class="leading-normal text-base md:text-2xl mb-8 text-center md:text-left text-nord4">
					Please don't file a cease and desist letter.
				</p>

				<p class="font-bold pb-8 lg:pb-6 text-center md:text-left fade-in text-nord4">
					Built with
					<a href="https://v3.vuejs.org/" class="text-nord8">Vue.js</a>,
					<a href="https://tailwindcss.com/" class="text-nord8">Tailwind</a>
					and
					<a href="https://firebase.google.com/" class="text-nord8">Firebase</a>.
					Source code is availble on <a href="https://github.com/ahsan-a/not-reddit-next" class="text-nord8">Github</a>
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
