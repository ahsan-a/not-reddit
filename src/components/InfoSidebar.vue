<template>
	<div class="w-full">
		<div class="sticky mt-4 top-20">
			<div class="sticky h-auto px-2 py-5 rounded-lg lg:p-5 bg-nord1 border-nord2">
				<div class="grid grid-flow-row grid-cols-2 mx-3 text-sm text-nord4 gap-y-1.5">
					<div>
						<router-link to="/about" class="hover:underline">About</router-link>
					</div>
					<div>
						<router-link to="/about/privacy" class="text-right hover:underline">Privacy Policy</router-link>
					</div>
					<div>
						<router-link to="/about/guidelines" class="hover:underline">Community Guidelines</router-link>
					</div>
				</div>
				<div class="mt-6 text-sm text-gray-300"> © {{ new Date().getFullYear() }} Ahsan Ahmed. All rights reserved. </div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
	setup() {
		return {
			store,
		};
	},
});
</script>
