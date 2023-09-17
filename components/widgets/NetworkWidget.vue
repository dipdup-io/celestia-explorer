<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex direction="column" gap="20" :class="$style.top">
			<Text size="16" weight="600" color="primary"> Network </Text>

			<Flex direction="column" gap="16">
				<Flex align="end" gap="16">
					<Flex align="center" gap="6">
						<Icon name="zap-circle" size="20" color="primary" />
						<Flex gap="4" align="end">
							<Text size="20" weight="600" color="primary">0</Text>
							<Text size="14" weight="700" color="tertiary">TPS</Text>
						</Flex>
					</Flex>

					<Flex align="center" gap="6">
						<Icon name="arrow-circle-right-up" size="16" color="tertiary" />
						<Text size="16" weight="600" color="tertiary">0%</Text>
					</Flex>
				</Flex>

				<Text size="12" weight="600" color="support"> Unavailable right now </Text>
			</Flex>
		</Flex>

		<Flex direction="column" justify="between" :class="$style.bottom">
			<Flex direction="column" gap="16">
				<Flex align="center" gap="4">
					<Icon name="level" size="12" color="secondary" />
					<Text size="13" weight="600" color="secondary">TPS Level</Text>
				</Flex>

				<Flex direction="column" gap="8">
					<Flex justify="between" :class="$style.levels">
						<div v-for="item in 9" :class="$style.level" />
					</Flex>

					<Flex align="center" justify="between" :class="$style.labels">
						<Text size="11" weight="600" color="tertiary">High</Text>
						<Text size="11" weight="600" color="tertiary">Low</Text>
					</Flex>
				</Flex>
			</Flex>

			<Text size="12" weight="600" color="support">Unknown Level</Text>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	background: var(--card-background);
	border-radius: 12px;
	overflow: hidden;
}

.top {
	padding: 16px 16px 20px 16px;
}

.bottom {
	height: 100%;

	background: rgba(0, 0, 0, 10%);
	border-top: 2px solid var(--op-5);

	padding: 20px 16px;
}

.levels {
	background: var(--op-5);
	border-radius: 50px;

	padding: 6px;
}

.level {
	width: 16px;
	height: 6px;

	background: var(--op-10);

	&:first-child {
		border-radius: 50px 0px 0px 50px;
	}

	&:last-child {
		border-radius: 0px 50px 50px 0px;
	}
}

.labels {
	margin: 0 8px;
}
</style>
