<template>
	<CookieBugger />
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CookieBugger from './components/CookieBugger.vue';
export default defineComponent({
	components: {
		CookieBugger,
	},
});
</script>

<style lang="stylus">
@import './assets/styles.styl';
body::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}
body::-webkit-scrollbar-track {
	background: nord0
}
body::-webkit-scrollbar-thumb {
	background: nord3
	border-radius: 10px;
}
body::-webkit-scrollbar-thumb:hover {
	background: nord2;
}
html {
	scroll-behavior: smooth;
}
body {
	background-color: nord0
}
</style>
