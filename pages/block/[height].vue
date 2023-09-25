<script setup>
/** Components: Modules */
import BlockOverview from "@/components/modules/block/BlockOverview.vue"
import BlobsTable from "@/components/modules/block/BlobsTable.vue"

/** Services */
import { comma } from "@/services/utils"

/** API */
import { fetchBlockByHeight } from "@/services/api/block"

const route = useRoute()
const router = useRouter()

const block = ref()

const { data: rawBlock } = await fetchBlockByHeight(route.params.height)

if (!rawBlock.value) {
	router.push("/")
} else {
	block.value = rawBlock.value
}

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
			<BlockOverview :block="block" />

			<BlobsTable />
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
