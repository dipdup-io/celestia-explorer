<script setup>
/** Components: Modules */
import BlockOverview from "@/components/modules/block/BlockOverview.vue"
import BlobsTable from "@/components/modules/block/BlobsTable.vue"

/** Services */
import { comma } from "@/services/utils"

/** API */
import { fetchBlockByHeight, fetchBlockNamespaces } from "@/services/api/block"
import { fetchTransactionsByBlock } from "@/services/api/tx"

const route = useRoute()
const router = useRouter()

const block = ref()
const transactions = ref([])

const isBlobsLoading = ref(true)
const blobs = ref([])

const { data: rawBlock } = await fetchBlockByHeight(route.params.height)
const { data: rawTxns } = await fetchTransactionsByBlock(route.params.height)

if (!rawBlock.value) {
	router.push("/")
} else {
	block.value = rawBlock.value
}

if (rawTxns.value?.length) {
	transactions.value = rawTxns.value
}

onMounted(async () => {
	const { data } = await fetchBlockNamespaces(route.params.height)
	blobs.value = data.value

	isBlobsLoading.value = false
})

useHead({
	title: `Block ${comma(block.value?.height)} - Celestia Explorer`,
})
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Breadcrumbs
			v-if="block"
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/blocks', name: 'Blocks' },
				{ link: route.fullPath, name: `Block ${comma(block.height)}` },
			]"
			:class="$style.breadcrumbs"
		/>

		<Flex v-if="block" direction="column" gap="40">
			<BlockOverview :block="block" :transactions="transactions" />

			<BlobsTable :blobs="blobs" :loading="isBlobsLoading" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 60px 24px;
}

.breadcrumbs {
	margin-bottom: 16px;
}

@media (max-width: 500px) {
	.wrapper {
		padding-left: 12px;
		padding-right: 12px;
	}
}
</style>
