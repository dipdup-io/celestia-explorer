<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"

/** Services */
import { comma, formatBytes } from "@/services/utils"

/** API */
import { fetchActiveNamespaces } from "@/services/api/namespace"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const namespaces = ref([])

const { data } = await fetchActiveNamespaces()
namespaces.value = data.value

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
			<Text size="14" weight="600" color="primary">Active Namespaces</Text>
		</Flex>

		<Flex direction="column" gap="16" :class="$style.namespaces_body">
			<table>
				<thead>
					<tr>
						<th><Text size="12" weight="600" color="tertiary">Hash</Text></th>
						<th><Text size="12" weight="600" color="tertiary">Height</Text></th>
						<th><Text size="12" weight="600" color="tertiary">When</Text></th>
						<th><Text size="12" weight="600" color="tertiary">Size</Text></th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="ns in namespaces">
						<td style="width: 1px">
							<Outline @click="handleCopy(ns.hash)" class="copyable">
								<Flex align="center" gap="8">
									<Icon name="block" size="14" color="tertiary" />

									<Text size="13" weight="700" color="secondary" mono>
										{{ ns.hash.slice(ns.hash.length - 6, ns.hash.length) }}
									</Text>
								</Flex>
							</Outline>
						</td>
						<td>
							<NuxtLink :to="`/block/${ns.height}`">
								<Outline>
									<Flex align="center" gap="6">
										<Icon name="block" size="14" color="tertiary" />

										<Text size="13" weight="600" color="primary">{{ comma(ns.height) }}</Text>
									</Flex>
								</Outline>
							</NuxtLink>
						</td>
						<td>
							<Text size="13" weight="600" color="primary">{{
								DateTime.fromISO(ns.time).toRelative({ locale: "en", style: "short" })
							}}</Text>
						</td>
						<td>
							<Flex align="center" gap="6">
								<Text size="13" weight="600" color="primary">{{ formatBytes(ns.size) }}</Text>
								<Text size="13" weight="600" color="tertiary">({{ ns.pfb_count }})</Text>
							</Flex>
						</td>
					</tr>
				</tbody>
			</table>

			<Button link="/namespaces" type="secondary" size="small" wide>
				<Text size="12" weight="600" color="primary">View all namespaces</Text>
				<Icon name="arrow-narrow-up-right" size="12" color="tertiary" />
			</Button>
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

.namespaces_body {
	border-radius: 4px 4px 8px 8px;
	background: var(--card-background);

	padding: 16px;

	& table {
		width: 100%;

		border-spacing: 0px;

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
</style>
