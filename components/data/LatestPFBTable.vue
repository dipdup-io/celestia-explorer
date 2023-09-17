<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"

/** API */
import { fetchLatestPFBs } from "@/services/api/tx"

const pfbs = ref([])

const { data } = await fetchLatestPFBs()
pfbs.value = data.value
</script>

<template>
	<Flex wide direction="column" gap="4">
		<Flex align="center" :class="$style.header">
			<Text size="14" weight="600" color="primary">Latest PFBs</Text>
		</Flex>

		<Flex direction="column" gap="16" :class="$style.pfb_body">
			<div :class="$style.table_scroller">
				<table>
					<thead>
						<tr>
							<th><Text size="12" weight="600" color="tertiary" noWrap>Hash</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>When</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>NS</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>Blobs Size</Text></th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="pfb in pfbs">
							<td style="width: 1px">
								<Outline>
									<Flex align="center" gap="8">
										<Icon name="zap" size="12" color="green" />

										<Text size="13" weight="700" color="secondary" mono>{{ pfb.hash.slice(0, 4) }}</Text>

										<Flex align="center" gap="3">
											<div v-for="dot in 3" :class="$style.dot" />
										</Flex>

										<Text size="13" weight="700" color="secondary" mono>{{
											pfb.hash.slice(pfb.hash.length - 4, pfb.hash.length)
										}}</Text>
									</Flex>
								</Outline>
							</td>
							<td>
								<Text size="13" weight="600" color="primary">{{
									DateTime.fromISO(pfb.time).setLocale("en").toRelative()
								}}</Text>
							</td>
							<td><Text size="13" weight="600" color="primary">5</Text></td>
							<td><Text size="13" weight="600" color="primary">350</Text></td>
						</tr>
					</tbody>
				</table>
			</div>

			<Button link="/transactions" type="secondary" size="small" wide>
				<Text size="12" weight="600" color="primary">View all transactions</Text>
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

.pfb_body {
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

.dot {
	width: 3px;
	height: 3px;

	border-radius: 50px;
	background: var(--txt-tertiary);
}

@media (max-width: 500px) {
	.table_scroller {
		overflow-x: auto;
	}
}
</style>
