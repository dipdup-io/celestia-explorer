export const useAppStore = defineStore("app", () => {
	const head = ref()
	const latestBlocks = ref([])

	return { head, latestBlocks }
})
