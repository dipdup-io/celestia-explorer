<script setup>
/** UI */
import Button from "@/components/ui/Button.vue"
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
						<th><Text size="12" weight="600" color="tertiary">When</Text></th>
						<th><Text size="12" weight="600" color="tertiary">Byte</Text></th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="item in 5">
						<td style="width: 1px">
							<Outline>
								<Flex align="center" gap="8">
									<Icon name="block" size="14" color="tertiary" />

									<Text size="13" weight="700" color="secondary" mono>AAAA</Text>

									<Flex align="center" gap="3">
										<div v-for="dot in 3" class="dot" />
									</Flex>

									<Text size="13" weight="700" color="secondary" mono>AAAA</Text>
								</Flex>
							</Outline>
						</td>
						<td><Text size="13" weight="600" color="primary">1 sec ago</Text></td>
						<td><Text size="13" weight="600" color="primary">350</Text></td>
					</tr>
				</tbody>
			</table>

			<Button type="secondary" size="small" wide disabled>
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
