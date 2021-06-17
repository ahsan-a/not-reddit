<template>
	<div class="bg" />
	<Navbar :padding="true" />
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	import Navbar from '@/components/Navbar.vue';
	export default defineComponent({
		components: {
			Navbar,
		},
		// setup() {},
	});
</script>

<style></style>
