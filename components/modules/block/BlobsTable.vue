<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { space, formatBytes } from "@/services/utils"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const props = defineProps({
	blobs: {
		type: Array,
	},
})

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
	<Flex direction="column" gap="4">
		<Flex align="center" :class="$style.header">
			<Text size="14" weight="600" color="primary">Blobs</Text>
		</Flex>

		<Flex wide :class="$style.table">
			<div v-if="blobs.length" :class="$style.table_scroller">
				<table>
					<thead>
						<tr>
							<th><Text size="12" weight="600" color="tertiary">Hash</Text></th>
							<th><Text size="12" weight="600" color="tertiary">Signer</Text></th>
							<th><Text size="12" weight="600" color="tertiary">Size</Text></th>
							<th><Text size="12" weight="600" color="tertiary">Version</Text></th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="blob in blobs">
							<td style="width: 1px">
								<Tooltip position="start" delay="500">
									<Outline @click="handleCopy(blob.namespace.hash)" class="copyable">
										<Flex align="center" gap="8">
											<Icon name="blob" size="12" color="tertiary" />

											<Text size="13" weight="700" color="secondary" mono>{{ blob.namespace.hash.slice(0, 4) }}</Text>

											<Flex align="center" gap="3">
												<div v-for="dot in 3" :class="$style.dot" />
											</Flex>

											<Text size="13" weight="700" color="secondary" mono>
												{{
													space(
														blob.namespace.hash.slice(
															blob.namespace.hash.length - 8,
															blob.namespace.hash.length,
														),
													)
												}}
											</Text>
										</Flex>
									</Outline>

									<template #content>
										{{ blob.namespace.hash }}
									</template>
								</Tooltip>
							</td>
							<td style="width: 1px">
								<Tooltip position="start" delay="500">
									<Flex @click="handleCopy(blob.data.Signer)" align="center" gap="6" class="copyable">
										<Text size="13" weight="600" color="primary">
											{{ blob.data.Signer }}
										</Text>
									</Flex>

									<template #content>
										{{ blob.data.Signer }}
									</template>
								</Tooltip>
							</td>
							<td>
								<Text size="13" weight="600" color="primary">
									{{ formatBytes(blob.namespace.size) }}
								</Text>
							</td>
							<td>
								<Text size="13" weight="600" color="primary">{{ blob.namespace.version }}</Text>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Flex v-else align="center" justify="center" direction="column" gap="8" wide>
				<Text size="13" weight="600" color="secondary" align="center"> No blobs </Text>
				<Text size="12" weight="500" height="160" color="tertiary" align="center" style="max-width: 220px">
					This block does not contain blobs
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.header {
	height: 46px;

	border-radius: 8px 8px 4px 4px;
	background: var(--card-background);

	padding: 0 16px;
}

.table_scroller {
	overflow-x: auto;
}

.table {
	border-radius: 4px 4px 8px 8px;
	background: var(--card-background);

	padding: 16px;

	& table {
		width: 100%;
		height: fit-content;

		border-spacing: 0px;

		& tr th {
			text-align: left;
			padding: 0;
			padding-right: 16px;
			padding-bottom: 8px;

			& span {
				display: flex;
			}
		}

		& tr td {
			padding: 0;
			padding-right: 24px;
			padding-top: 6px;
			padding-bottom: 6px;

			white-space: nowrap;
		}
	}
}

.dot {
	width: 3px;
	height: 3px;

	border-radius: 50px;
	background: var(--txt-tertiary);
}
</style>
