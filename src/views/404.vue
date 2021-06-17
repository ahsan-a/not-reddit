<template>
	<div class="w-screen h-screen main">
		<Navbar />
		<div class="container flex flex-col flex-wrap items-center px-6 pt-24 mx-auto md:pt-48 md:flex-row">
			<div class="flex flex-col justify-center w-full overflow-y-hidden xl:w-2/5 lg:items-start">
				<p class="my-4 text-3xl font-bold leading-tight text-center md:text-5xl text-nord4 md:text-left slide-in-bottom-h1 ">
					The page could not be found.
				</p>
				<p class="mb-8 text-base leading-normal text-center md:text-2xl md:text-left slide-in-bottom-subtitle text-nord4"></p>
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
		setup() {
			document.title = '(not) reddit';
		},
	});
</script>

<style lang="stylus" scoped>
	nord0 = #2e3440

	.main {
		position fixed
		background nord0 url('../assets/logo.png') no-repeat center center
		z-index -1
	}
</style>
