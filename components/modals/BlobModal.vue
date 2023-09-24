<script setup>
/** UI */
import Modal from "@/components/ui/Modal.vue"
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { comma, formatBytes } from "@/services/utils"

/** API */
import { fetchNamespaceByHash } from "@/services/api/namespace"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const emit = defineEmits(["onClose"])
const props = defineProps({
	show: Boolean,
	item: Object,
})

const blob = ref({})
const notFound = ref(false)

const isDecode = ref(false)
const isViewAll = ref(false)

const rawData = computed(() => {
	return blob.value.data
})
const decodedData = computed(() => {
	const result = Uint8Array.from(atob(blob.value.data), (m) => m.codePointAt(0))
	return Array.from(result).toString()
})
const viewData = computed(() => {
	if (!isDecode.value) {
		return isViewAll.value ? rawData.value : rawData.value.slice(0, 100)
	} else {
		return isViewAll.value ? decodedData.value : decodedData.value.slice(0, 100)
	}
})

watch(
	() => props.show,
	async () => {
		if (props.show) {
			const { data } = await fetchNamespaceByHash({
				hash: props.item.namespace.hash,
				height: props.item.height,
				commitment: props.item.data.ShareCommitments[0],
			})

			if (data.value) {
				blob.value = data.value
			} else {
				notFound.value = true
			}
		} else {
			isDecode.value = false
			isViewAll.value = false
			blob.value = {}
		}
	},
)

const handleDownload = () => {
	var element = document.createElement("a")
	element.style.display = "none"
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(rawData.value))
	element.setAttribute("download", `${props.item.namespace.hash}.txt`)

	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

const handleCopy = (target) => {
	window.navigator.clipboard.writeText(target)

	notificationsStore.create({
		notification: {
			type: "info",
			icon: "check",
			title: "Successfully copied to clipboard",
			autoDestroy: true,
		},
	})
}
</script>

<template>
	<Modal :show="show" @onClose="emit('onClose')" width="600" disable-trap>
		<Flex direction="column" gap="24">
			<Text size="14" weight="600" color="primary">Blob Viewer</Text>

			<Flex v-if="blob.data" direction="column" gap="24">
				<Flex direction="column" gap="12">
					<Flex direction="column" gap="8" :class="$style.data">
						<Text size="13" weight="500" height="160" color="secondary" mono :class="$style.field">
							{{ viewData }}<Text v-if="!isViewAll && blob.data.length > 100" color="tertiary">...</Text>
						</Text>

						<Text v-if="blob.data.length > 100 && !isViewAll" size="12" weight="500" color="tertiary">
							Hidden {{ comma(isDecode ? decodedData.length - 100 : rawData.length - 100) }} characters
						</Text>
					</Flex>
					<Button @click="isViewAll = !isViewAll" type="secondary" size="small" wide>
						{{ isViewAll ? "Collapse" : "Expand" }}
					</Button>
				</Flex>

				<Flex direction="column" align="center" gap="16">
					<Flex align="center" justify="between" wide>
						<Text size="12" weight="500" color="tertiary">Hash:</Text>

						<Tooltip position="end" delay="500">
							<Flex @click="handleCopy(blob.namespace)" align="center" gap="6" class="copyable">
								<Text size="13" weight="600" color="primary">
									{{ blob.namespace.slice(0, 4) }}
								</Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" class="dot" />
								</Flex>

								<Text size="13" weight="600" color="primary">
									{{ blob.namespace.slice(blob.namespace.length - 4, blob.namespace.length) }}
								</Text>
							</Flex>

							<template #content>
								{{ blob.namespace }}
							</template>
						</Tooltip>
					</Flex>

					<Flex align="center" justify="between" wide>
						<Text size="12" weight="500" color="tertiary">Commitment:</Text>

						<Tooltip position="end" delay="500">
							<Flex @click="handleCopy(item.data.ShareCommitments[0])" align="center" gap="6" class="copyable">
								<Text size="13" weight="600" color="primary">
									{{ item.data.ShareCommitments[0].slice(0, 4) }}
								</Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" class="dot" />
								</Flex>

								<Text size="13" weight="600" color="primary">
									{{
										item.data.ShareCommitments[0].slice(
											item.data.ShareCommitments[0].length - 4,
											item.data.ShareCommitments[0].length,
										)
									}}
								</Text>
							</Flex>

							<template #content>
								{{ item.data.ShareCommitments[0] }}
							</template>
						</Tooltip>
					</Flex>
				</Flex>
			</Flex>
			<Text v-else-if="notFound" size="12" weight="600" color="tertiary"> Blob not found </Text>

			<Flex v-if="blob.data" align="center" gap="8">
				<Button @click="handleDownload" type="secondary" size="small">
					<Icon name="download" size="14" color="secondary" />
					<Flex align="center" gap="6">
						<Text>Download</Text>
						<Text color="tertiary">{{ formatBytes(item.data.BlobSizes[0]) }}</Text>
					</Flex>
				</Button>

				<Button @click="isDecode = !isDecode" type="secondary" size="small"> {{ isDecode ? "Encode" : "Decode" }} Base64 </Button>
			</Flex>
		</Flex>
	</Modal>
</template>

<style module>
.data {
	max-height: 200px;
	min-height: 200px;

	user-select: text;
	border-radius: 6px;
	background: rgba(0, 0, 0, 15%);
	box-shadow: inset 0 0 0 1px var(--op-10);
	overflow-y: auto;
	overflow-x: hidden;

	padding: 16px;

	& .field {
		min-width: 100%;
		width: 0;

		display: inline-block;
		word-wrap: break-word;
	}
}
</style>
