<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { tia, comma, space, formatBytes } from "@/services/utils"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const props = defineProps({
	block: {
		type: Object,
		required: true,
	},
	transactions: {
		type: Array,
	},
})

const tabs = ref(["PFBs", "Transfers", "Delegate", "Other"])
const activeTab = ref(tabs.value[0])

const MapTabsTypes = {
	PFBs: "MsgPayForBlobs",
	Transfers: "MsgSend",
	Delegate: "MsgDelegate",
}

const filteredTransactions = computed(() => {
	const supportedTypes = Object.values(MapTabsTypes)

	if (activeTab.value === "Other") {
		return props.transactions.filter((t) => {
			let f = false

			t.message_types.forEach((type) => {
				if (!supportedTypes.includes(type)) f = true
			})

			return f
		})
	}

	return props.transactions.filter((t) => t.message_types.includes(MapTabsTypes[activeTab.value]))
})

const getTxnsLengthByTab = (tab) => {
	const supportedTypes = Object.values(MapTabsTypes)

	if (tab === "Other") {
		return props.transactions.filter((t) => {
			let f = false

			t.message_types.forEach((type) => {
				if (!supportedTypes.includes(type)) f = true
			})

			return f
		}).length
	}

	return props.transactions.filter((t) => t.message_types.includes(MapTabsTypes[tab])).length
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
	<Flex direction="column" gap="4">
		<Flex align="center" justify="between" :class="$style.header">
			<Text size="14" weight="600" color="primary">Block Overview</Text>
		</Flex>

		<Flex gap="4" :class="$style.content">
			<Flex direction="column" :class="$style.data">
				<Flex wide direction="column" gap="16" :class="$style.top">
					<Flex align="center" justify="between" wide>
						<Flex align="center" gap="8">
							<Icon name="block" size="14" color="primary" />

							<Flex align="center" gap="4">
								<Text size="12" weight="600" color="secondary"> Block </Text>
								<Text size="12" weight="600" color="primary">{{ comma(block.height) }}</Text>
							</Flex>
						</Flex>

						<Text size="12" weight="600" color="tertiary">
							{{ DateTime.fromISO(block.time).setLocale("en").toFormat("ff") }}
						</Text>
					</Flex>

					<Flex align="center" justify="between" :class="$style.timing">
						<Text size="12" weight="600" color="secondary" :class="$style.fixed_width">
							{{
								DateTime.fromISO(block.time).minus({ milliseconds: block.stats.block_time }).setLocale("en").toFormat("TT")
							}}
						</Text>

						<div v-for="dot in 5" class="dot" />

						<Flex align="center" gap="6" :class="$style.fixed_width">
							<Icon name="time" size="12" color="secondary" />
							<Text size="12" weight="600" color="primary"> {{ (block.stats.block_time / 1_000).toFixed(2) }}s </Text>
						</Flex>

						<div v-for="dot in 5" class="dot" />

						<Text size="12" weight="600" color="secondary" align="right" :class="$style.fixed_width">
							{{ DateTime.fromISO(block.time).setLocale("en").toFormat("TT") }}</Text
						>
					</Flex>
				</Flex>

				<Flex direction="column" gap="24" :class="$style.main">
					<Flex align="center" gap="40">
						<Flex @click="handleCopy(block.hash)" direction="column" gap="12" class="copyable">
							<Text size="12" weight="600" color="tertiary">Hash</Text>

							<Flex align="center" gap="6">
								<Text size="13" weight="600" color="primary">{{ block.hash.slice(0, 4) }}</Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" class="dot" />
								</Flex>

								<Text size="13" weight="600" color="primary">{{
									block.hash.slice(block.hash.length - 4, block.hash.length)
								}}</Text>
							</Flex>
						</Flex>

						<Flex @click="handleCopy(block.proposer_address)" direction="column" gap="12" class="copyable">
							<Text size="12" weight="600" color="tertiary">Proposer</Text>

							<Flex align="center" gap="6">
								<Text size="13" weight="600" color="primary">{{ block.proposer_address.slice(0, 4) }}</Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" class="dot" />
								</Flex>

								<Text size="13" weight="600" color="primary">{{
									block.proposer_address.slice(block.proposer_address.length - 4, block.proposer_address.length)
								}}</Text>
							</Flex>
						</Flex>
					</Flex>

					<Flex direction="column" gap="16">
						<Text size="12" weight="600" color="secondary">Details</Text>

						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Blobs Size</Text>
							<Text size="12" weight="600" color="secondary"> {{ formatBytes(block.stats.blobs_size) }} </Text>
						</Flex>
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Events</Text>
							<Text size="12" weight="600" color="secondary"> {{ block.stats.events_count }} </Text>
						</Flex>
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Transactions</Text>
							<Text size="12" weight="600" color="secondary"> {{ block.stats.tx_count }} </Text>
						</Flex>
						<Flex align="center" justify="between">
							<Text size="12" weight="600" color="tertiary"> Fee </Text>
							<Text size="12" weight="600" color="secondary"> {{ tia(block.stats.fee) }} TIA</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Flex direction="column" gap="4" wide>
				<Flex align="center" justify="between" :class="$style.tabs_wrapper">
					<Flex gap="24" :class="$style.tabs">
						<Flex
							@click="activeTab = tab"
							v-for="tab in tabs"
							align="center"
							gap="6"
							:class="[$style.tab, activeTab === tab && $style.active]"
						>
							<Text size="13" weight="600">{{ tab }}</Text>

							<Text v-if="getTxnsLengthByTab(tab)" size="11" height="110" weight="600" :class="$style.badge">
								{{ getTxnsLengthByTab(tab) }}
							</Text>
						</Flex>
					</Flex>

					<Text size="12" weight="600" color="support" :class="$style.hint">Transactions</Text>
				</Flex>

				<Flex :class="$style.table">
					<div v-if="filteredTransactions.length" :class="$style.table_scroller">
						<table>
							<thead>
								<tr>
									<th><Text size="12" weight="600" color="tertiary">Hash</Text></th>
									<th><Text size="12" weight="600" color="tertiary">Gas</Text></th>
									<th><Text size="12" weight="600" color="tertiary">Fee</Text></th>
									<th><Text size="12" weight="600" color="tertiary">Events</Text></th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="tx in filteredTransactions">
									<td style="width: 1px">
										<Tooltip position="start" delay="500">
											<Outline @click="handleCopy(tx.hash)" class="copyable">
												<Flex align="center" gap="8">
													<Icon name="zap" size="12" :color="tx.status === 'success' ? 'green' : 'red'" />

													<Text size="13" weight="700" color="secondary" mono>{{ tx.hash.slice(0, 4) }}</Text>

													<Flex align="center" gap="3">
														<div v-for="dot in 3" class="dot" />
													</Flex>

													<Text size="13" weight="700" color="secondary" mono>{{
														tx.hash.slice(tx.hash.length - 4, tx.hash.length)
													}}</Text>
												</Flex>
											</Outline>

											<template #content>
												{{ tx.hash }}
											</template>
										</Tooltip>
									</td>
									<td style="width: 1px">
										<Flex align="center" gap="4">
											<Text size="13" weight="600" color="primary">{{ comma(tx.gas_used) }}</Text>
											<Text size="13" weight="600" color="tertiary">/</Text>
											<Text size="13" weight="600" color="secondary">{{ comma(tx.gas_wanted) }}</Text>
											<Text v-if="tx.gas_wanted > 0" size="13" weight="600" color="tertiary">
												({{ ((tx.gas_used * 100) / tx.gas_wanted).toFixed(2) }}%)
											</Text>
										</Flex>
									</td>
									<td>
										<Flex align="center" gap="4">
											<Text size="13" weight="600" color="primary"> {{ tia(tx.fee) }} </Text>
											<Text size="13" weight="600" color="tertiary">TIA</Text>
										</Flex>
									</td>
									<td>
										<Text size="13" weight="600" color="primary">
											{{ tx.events_count }}
										</Text>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<Flex v-else align="center" justify="center" direction="column" gap="8" wide>
						<Text size="13" weight="600" color="secondary" align="center"> No transactions </Text>
						<Text size="12" weight="500" height="160" color="tertiary" align="center" style="max-width: 220px">
							This block does not contain transactions of the selected type
						</Text>
					</Flex>
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

.data {
	min-width: 384px;

	border-radius: 4px 4px 4px 8px;
	background: var(--card-background);

	.top {
		padding: 16px;

		border-bottom: 1px solid var(--op-5);
	}

	.timing {
		height: 28px;

		border-radius: 6px;
		background: linear-gradient(var(--op-8), var(--op-3));
		box-shadow: inset 0 0 0 1px var(--op-5);

		padding: 0 8px;

		.fixed_width {
			width: 60px;
		}
	}

	.main {
		padding: 16px;
	}
}

.tabs_wrapper {
	min-height: 40px;

	border-radius: 4px;
	background: var(--card-background);

	padding: 0 16px;
}

.tabs {
	height: 100%;
}

.tab {
	height: 100%;

	cursor: pointer;
	border-bottom: 2px solid transparent;

	& span {
		color: var(--txt-tertiary);

		transition: all 0.1s ease;
	}

	&:hover {
		& span {
			color: var(--txt-secondary);
		}
	}
}

.tab.active {
	border-bottom: 2px solid var(--blue);

	& span {
		color: var(--txt-primary);
	}
}

.table_scroller {
	min-width: 100%;
	width: 0;

	overflow-x: auto;
}

.table {
	height: 100%;

	border-radius: 4px 4px 8px 4px;
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

.badge {
	border-radius: 5px;
	background: var(--op-5);
	box-shadow: inset 0 0 0 1px var(--op-10);

	padding: 4px 6px;
}

@media (max-width: 800px) {
	.content {
		flex-direction: column;
	}

	.data {
		min-width: initial;

		border-radius: 4px;
	}

	.table {
		border-radius: 4px 4px 8px 8px;
	}
}

@media (max-width: 400px) {
	.tabs_wrapper {
		overflow-x: auto;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.hint {
		display: none;
	}
}
</style>
