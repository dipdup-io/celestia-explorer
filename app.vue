<script setup>
/** API */
import { fetchHead } from "@/services/api/main"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const { data } = await fetchHead()
appStore.head = data.value
</script>

<template>
	<NuxtLayout>
		<NuxtPage />

		<div id="tooltip" />
		<div id="modal" />

		<Notifications />
	</NuxtLayout>
</template>
