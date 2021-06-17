<template>
	<router-view />
</template>

<style lang="stylus">
	@import './assets/styles.styl';
	.bg {
		position: fixed
		width: 1000vw
		height: 1000vh
		background-color: #2e3440
		z-index: -10
	}
	::-webkit-scrollbar {
		width: 10px;
	}
	::-webkit-scrollbar-track {
		background: nord0
	}
	::-webkit-scrollbar-thumb {
		background: nord3
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: nord2;
	}
</style>
