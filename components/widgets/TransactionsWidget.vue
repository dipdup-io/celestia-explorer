<template>
	<Flex direction="column" gap="20" :class="$style.wrapper">
		<Flex justify="between">
			<Flex align="center" gap="6">
				<Icon name="zap" size="16" color="primary" />
				<Flex gap="4" align="end">
					<Text size="16" weight="600" color="primary">0</Text>
					<Text size="12" weight="700" color="tertiary">TXs</Text>
				</Flex>
			</Flex>

			<Text size="12" weight="600" color="tertiary">24h</Text>
		</Flex>

		<!-- Chart -->
		<Flex gap="16" :class="$style.chart">
			<Flex direction="column" justify="between" :class="$style.yAxis">
				<Text size="12" weight="600" color="secondary">200</Text>
				<Text size="12" weight="600" color="secondary">100</Text>
				<Text size="12" weight="600" color="secondary">0</Text>
			</Flex>

			<Flex wide :class="$style.sectors">
				<Flex v-for="item in 4" direction="column" gap="8" wide :class="$style.sector">
					<Flex justify="between" :class="$style.hours">
						<Flex v-for="hour in 6" direction="column" justify="end" gap="6" :class="$style.hour">
							<div :style="{ height: `${Math.floor(Math.random() * 50)}%` }" :class="$style.bar" />
							<div :class="$style.dot" />
						</Flex>
					</Flex>

					<Text size="12" weight="600" color="tertiary">
						{{ `${(item - 1) * 6 < 10 ? "0" : ""}${(item - 1) * 6}` }}
					</Text>
				</Flex>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	height: 100%;

	background: var(--card-background);
	border-radius: 12px;
	overflow: hidden;

	padding: 16px;
}

.chart {
	flex: 1;
}

.yAxis {
	height: 100%;

	padding-bottom: 20px;
}

.sector {
	border-left: 2px solid var(--op-5);

	padding: 0 8px;

	&:last-child {
		border-right: 2px solid var(--op-5);
	}
}

.hours {
	height: 100%;
}

.bar {
	width: 4px;
	height: 15%;

	border-radius: 50px;
	background: var(--txt-tertiary);
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-5);
}
</style>
