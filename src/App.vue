<template>
	<router-view />
</template>

<style lang="stylus">
	@import './assets/styles.styl';
	body::-webkit-scrollbar {
		width: 10px;
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
</style>
