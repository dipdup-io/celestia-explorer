<script setup>
/** API */
import { initSocket } from "@/services/api/socket"
import { fetchHead } from "@/services/api/main"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const { data } = await fetchHead()
appStore.head = data.value

onMounted(() => {
	initSocket()
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage />

		<div id="tooltip" />
		<div id="modal" />

		<Notifications />
	</NuxtLayout>
</template>
