<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { comma } from "@/services/utils"

defineOptions({
	inheritAttrs: false,
})

const props = defineProps({
	title: String,
	block: Object,
})
</script>

<template>
	<div class="relative w-full h-full" style="background: #17191b">
		<div class="flex flex-col justify-end p-20 h-full">
			<span class="text-3xl font-medium text-slate-500 mt-5">Block</span>
			<h1 class="text-6xl font-medium text-white mt-5">{{ comma(block.height) }}</h1>

			<div class="flex flex-row mt-4">
				<span class="text-lg text-white font-semibold py-1 px-2 border-2 border-blue-500 border-solid rounded-lg mr-2 bg-blue-600">
					{{ block.message_types[0] }}
				</span>
			</div>

			<span class="text-xl font-medium text-slate-500 mt-4">{{ DateTime.fromISO(block.time).toFormat("ff") }}</span>
		</div>
	</div>
</template>
