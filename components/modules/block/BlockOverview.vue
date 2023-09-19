<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"
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

const tabs = ref(["PFBs", "Transfers", "Delegate"])
const activeTab = ref(tabs.value[0])

const MapTabsTypes = {
	PFBs: "MsgPayForBlobs",
	Transfers: "MsgSend",
	Delegate: "MsgDelegate",
}

const filteredTransactions = computed(() => props.transactions.filter((t) => t.message_types.includes(MapTabsTypes[activeTab.value])))

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
			<Flex align="center" gap="8">
				<Icon name="block" size="16" color="secondary" />
				<Text size="14" weight="600" color="primary">Block Overview</Text>
			</Flex>
		</Flex>

		<Flex gap="4" :class="$style.content">
			<Flex direction="column" :class="$style.data">
				<Flex wide direction="column" gap="20" :class="$style.top">
					<Flex justify="between">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="tertiary"> Block </Text>
							<Text size="16" weight="600" color="primary">{{ comma(block.height) }}</Text>
						</Flex>

						<Text size="12" weight="500" color="tertiary">
							{{ DateTime.fromISO(block.time).setLocale("en").toFormat("ff") }}
						</Text>
					</Flex>

					<Tooltip position="start" delay="500">
						<Outline @click="handleCopy(block.hash)" wide padding="8" class="copyable">
							<Flex justify="between" align="center" gap="8" wide>
								<Text size="12" weight="700" color="secondary" mono> {{ space(block.hash.slice(0, 12)) }} </Text>

								<Flex align="center" gap="3">
									<div v-for="dot in 3" class="dot" />
								</Flex>

								<Text size="12" weight="700" color="secondary" mono>
									{{ space(block.hash.slice(block.hash.length - 12, block.hash.length)) }}
								</Text>
							</Flex>
						</Outline>

						<template #content>
							{{ space(block.hash) }}
						</template>
					</Tooltip>
				</Flex>

				<Flex direction="column" gap="24" :class="$style.main">
					<Flex direction="column" gap="12">
						<Text size="12" weight="600" color="tertiary">Proposer</Text>
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">{{ space(block.proposer_address.slice(0, 8)) }}</Text>

							<Flex align="center" gap="3">
								<div v-for="dot in 3" class="dot" />
							</Flex>

							<Text size="13" weight="600" color="primary">
								{{ space(block.proposer_address.slice(block.proposer_address.length - 8, block.proposer_address.length)) }}
							</Text>
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
							<Text
								v-if="transactions.filter((t) => t.message_types.includes(MapTabsTypes[tab])).length"
								size="13"
								weight="600"
							>
								{{ transactions.filter((t) => t.message_types.includes(MapTabsTypes[tab])).length }}
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
									<th><Text size="12" weight="600" color="tertiary">Messages</Text></th>
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
									<td>
										<Text size="13" weight="600" color="primary">
											{{ tx.messages_count }}
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

	.main {
		padding: 16px;
	}
}

.tabs_wrapper {
	height: 40px;

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
	background: rgba(0, 0, 0, 40%);

	padding: 8px;
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
