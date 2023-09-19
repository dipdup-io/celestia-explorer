<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { tia, comma, space, formatBytes } from "@/services/utils"

/** API */
import { fetchBlocks, fetchBlockNamespaces } from "@/services/api/block"
import { fetchTransactionsByBlock } from "@/services/api/tx"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const blocks = ref([])

const preview = reactive({
	block: null,
	transactions: [],
	pfbs: [],
})

watch(
	() => preview.block,
	async () => {
		if (preview.block.stats.tx_count) {
			const { data } = await fetchTransactionsByBlock(preview.block.height)
			preview.transactions = data.value
		}
	},
)

watch(
	() => preview.transactions,
	async () => {
		const hasPFB = !!preview.transactions.filter((t) => t.message_types.includes("MsgPayForBlobs"))
		if (!hasPFB) return

		const { data } = await fetchBlockNamespaces(preview.block.height)
		preview.pfbs = data.value
	},
)

const { data } = await fetchBlocks({ limit: 15 })

blocks.value = data.value
preview.block = blocks.value[0]

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
	<Flex wide direction="column" gap="4">
		<Flex align="center" :class="$style.header">
			<Text size="14" weight="600" color="primary">Blocks Timeline</Text>
		</Flex>

		<Flex gap="4" :class="$style.content">
			<Flex direction="column" gap="16" wide :class="$style.table">
				<div :class="$style.table_scroller">
					<table>
						<thead>
							<tr>
								<th><Text size="12" weight="600" color="tertiary">Height</Text></th>
								<th><Text size="12" weight="600" color="tertiary">When</Text></th>
								<th><Text size="12" weight="600" color="tertiary">Hash</Text></th>
								<th><Text size="12" weight="600" color="tertiary">Proposer</Text></th>
								<th><Text size="12" weight="600" color="tertiary">Fee</Text></th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="block in blocks" @click="preview.block = block">
								<td style="width: 1px">
									<Outline>
										<Flex align="center" gap="6">
											<Icon name="block" size="14" color="tertiary" />

											<Text size="13" weight="600" color="primary">{{ comma(block.height) }}</Text>
										</Flex>
									</Outline>
								</td>
								<td>
									<Text size="13" weight="600" color="primary">{{
										DateTime.fromISO(block.time).setLocale("en").toRelative()
									}}</Text>
								</td>
								<td>
									<Tooltip delay="500">
										<template #default>
											<Flex @click="handleCopy(block.hash)" align="center" gap="4" class="copyable">
												<Text size="13" weight="600" color="secondary">{{ block.hash.slice(0, 4) }}</Text>
												<Text size="13" weight="600" color="tertiary">...</Text>
												<Text size="13" weight="600" color="secondary">
													{{ block.hash.slice(block.hash.length - 4, block.hash.length) }}
												</Text>
											</Flex>
										</template>

										<template #content> {{ space(block.hash) }} </template>
									</Tooltip>
								</td>
								<td>
									<Tooltip delay="500">
										<template #default>
											<Flex @click="handleCopy(block.proposer_address)" align="center" gap="4" class="copyable">
												<Text size="13" weight="600" color="secondary">{{
													block.proposer_address.slice(0, 4)
												}}</Text>
												<Text size="13" weight="600" color="tertiary">...</Text>
												<Text size="13" weight="600" color="secondary">{{
													block.proposer_address.slice(
														block.proposer_address.length - 4,
														block.proposer_address.length,
													)
												}}</Text>
											</Flex>
										</template>

										<template #content> {{ space(block.proposer_address) }} </template>
									</Tooltip>
								</td>
								<td>
									<Flex align="center" gap="4">
										<Text size="13" weight="600" color="primary"> {{ tia(block.stats.fee) }} </Text>
										<Text size="13" weight="600" color="tertiary"> TIA </Text>
									</Flex>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<Button link="/blocks" type="secondary" size="small" wide>
					<Text size="12" weight="600" color="primary">View all blocks</Text>
					<Icon name="arrow-narrow-up-right" size="12" color="tertiary" />
				</Button>
			</Flex>

			<Flex direction="column" :class="$style.preview">
				<Flex wide direction="column" gap="20" :class="$style.top">
					<Flex justify="between">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="tertiary"> Block </Text>
							<Text size="16" weight="600" color="primary">{{ comma(preview.block.height) }}</Text>
						</Flex>

						<Text size="12" weight="500" color="tertiary">{{
							DateTime.fromISO(preview.block.time).setLocale("en").toFormat("ff")
						}}</Text>
					</Flex>

					<Tooltip delay="500" wide>
						<Outline @click="handleCopy(preview.block.hash)" wide padding="8" class="copyable">
							<Flex justify="between" align="center" gap="8" wide>
								<Text size="12" weight="700" color="secondary" mono> {{ space(preview.block.hash.slice(0, 12)) }} </Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" :class="$style.dot" />
								</Flex>

								<Text size="12" weight="700" color="secondary" mono>
									{{ space(preview.block.hash.slice(preview.block.hash.length - 12, preview.block.hash.length)) }}
								</Text>
							</Flex>
						</Outline>

						<template #content>
							{{ space(preview.block.hash) }}
						</template>
					</Tooltip>
				</Flex>

				<Flex direction="column" gap="24" :class="$style.main">
					<Flex direction="column" gap="12">
						<Text size="12" weight="600" color="tertiary">Proposer</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">{{ space(preview.block.proposer_address.slice(0, 8)) }}</Text>
							<Text size="13" weight="600" color="tertiary">...</Text>
							<Text size="13" weight="600" color="primary">{{
								space(
									preview.block.proposer_address.slice(
										preview.block.proposer_address.length - 8,
										preview.block.proposer_address.length,
									),
								)
							}}</Text>
						</Flex>
					</Flex>

					<Flex direction="column" gap="12">
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary">Transactions</Text>
							<Text size="12" weight="600" color="secondary">
								{{ preview.block.stats.tx_count > 3 ? "3 /" : "" }} {{ preview.block.stats.tx_count }}
							</Text>
						</Flex>

						<Flex v-if="preview.block.stats.tx_count" direction="column" gap="8">
							<Outline v-for="transaction in preview.transactions.slice(0, 3)" wide height="32" padding="8" radius="6">
								<Flex align="center" gap="8">
									<Icon name="zap" size="12" color="green" />

									<Text size="13" weight="700" color="primary" mono>{{ transaction.hash.slice(0, 4) }}</Text>

									<Flex align="center" gap="3">
										<div v-for="dot in 3" :class="$style.dot" />
									</Flex>

									<Text size="13" weight="700" color="primary" mono>
										{{ transaction.hash.slice(transaction.hash.length - 4, transaction.hash.length) }}
									</Text>
								</Flex>
							</Outline>
						</Flex>
						<Text v-else size="12" weight="600" color="tertiary" align="center" :class="$style.badge"> No transactions </Text>
					</Flex>

					<Flex direction="column" gap="12">
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary">Blobs</Text>
							<Text size="12" weight="600" color="secondary">
								{{ preview.pfbs.length > 3 ? "3 /" : "" }} {{ preview.pfbs.length }}
							</Text>
						</Flex>

						<Flex v-if="preview.pfbs.length" direction="column" gap="8">
							<Outline v-for="pfb in preview.pfbs.slice(0, 3)" wide height="32" padding="8" radius="6">
								<Flex align="center" justify="between" wide>
									<Flex align="center" gap="8">
										<Icon name="blob" size="12" color="secondary" />

										<Text size="13" weight="700" color="primary" mono>{{ pfb.namespace.hash.slice(0, 4) }}</Text>

										<Flex align="center" gap="3">
											<div v-for="dot in 3" :class="$style.dot" />
										</Flex>

										<Text size="13" weight="700" color="primary" mono>
											{{ space(pfb.namespace.hash.slice(pfb.namespace.hash.length - 8, pfb.namespace.hash.length)) }}
										</Text>
									</Flex>

									<Text size="12" weight="600" color="tertiary">{{ formatBytes(pfb.namespace.size) }}</Text>
								</Flex>
							</Outline>
						</Flex>
						<Text v-else size="12" weight="600" color="tertiary" align="center" :class="$style.badge"> No blobs </Text>
					</Flex>

					<Flex direction="column" gap="16">
						<Text size="12" weight="600" color="secondary">Details</Text>

						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Events</Text>
							<Text size="12" weight="600" color="secondary"> {{ preview.block.stats.events_count }} </Text>
						</Flex>
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Blobs </Text>
							<Text size="12" weight="600" color="secondary"> {{ formatBytes(preview.block.stats.blobs_size) }} </Text>
						</Flex>
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Fee </Text>
							<Text size="12" weight="600" color="secondary"> {{ tia(preview.block.stats.fee) }} TIA </Text>
						</Flex>
					</Flex>
				</Flex>

				<Flex :class="$style.bottom">
					<Button :link="`/block/${preview.block.height}`" type="secondary" size="small" wide>
						<Text size="12" weight="600" color="primary">View Block</Text>
						<Icon name="arrow-narrow-up-right" size="12" color="tertiary" />
					</Button>
				</Flex>
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

.table {
	border-radius: 4px 4px 4px 8px;
	background: var(--card-background);

	padding: 16px;

	& table {
		width: 100%;
		height: fit-content;

		border-spacing: 0px;

		& tbody {
			& tr {
				cursor: pointer;

				transition: all 0.07s ease;
			}

			&:hover {
				& tr:not(:hover) {
					opacity: 0.35;
				}
			}
		}

		& tr th {
			text-align: left;
			padding: 0;
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

.preview {
	min-width: 384px;

	border-radius: 4px 4px 8px 4px;
	background: var(--card-background);

	.top {
		padding: 16px;

		border-bottom: 1px solid var(--op-5);
	}

	.main {
		flex: 1;

		border-bottom: 1px solid var(--op-5);

		padding: 16px;
	}

	.bottom {
		padding: 16px;

		& a {
			width: 100%;
		}
	}
}

.dot {
	width: 3px;
	height: 3px;

	border-radius: 50px;
	background: var(--txt-tertiary);
}

.badge {
	border-radius: 5px;
	background: rgba(0, 0, 0, 40%);

	padding: 8px;
}

@media (max-width: 900px) {
	.content {
		flex-direction: column-reverse;
	}

	.main {
		display: none;
	}

	.preview {
		border-radius: 4px;
	}

	.table {
		border-radius: 4px 4px 8px 8px;
	}
}

@media (max-width: 500px) {
	.preview {
		min-width: initial;
	}

	.table_scroller {
		overflow-x: auto;
	}
}
</style>
