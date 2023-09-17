<script setup>
/** Services */
import { comma } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const head = computed(() => appStore.head)
</script>

<template>
	<NuxtLink :to="`/block/${head.last_height}`">
		<Flex direction="column" justify="between" wide :class="$style.wrapper">
			<Flex justify="between">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Text size="16" weight="600" color="primary"> Block </Text>
						<Text size="16" weight="600" color="green"> {{ comma(head.last_height) }}</Text>
					</Flex>

					<Text size="13" weight="500" color="tertiary"> Chain Mocha-4 </Text>
				</Flex>

				<Flex direction="column" gap="8" align="end">
					<Text size="14" weight="600" color="primary"> 11.52s </Text>
					<Text size="12" weight="500" color="tertiary"> Previous Block </Text>
				</Flex>
			</Flex>

			<Flex align="center" justify="between" :class="$style.bar">
				<Icon name="block" size="16" color="primary" />

				<div v-for="item in 14" :class="$style.dot" />

				<Flex>
					<Text size="14" weight="600" color="primary">0</Text>
					<Text size="14" weight="600" color="tertiary">s</Text>
				</Flex>

				<!-- <div :class="$style.fill" /> -->
			</Flex>
		</Flex>
	</NuxtLink>
</template>

<style module>
.wrapper {
	height: 122px;

	border-radius: 12px;
	background: var(--card-background);

	padding: 16px;
}

.bar {
	position: relative;
	height: 28px;
	z-index: 0;

	border-radius: 6px;
	background: var(--op-5);
	overflow: hidden;

	padding: 0 8px;
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-30);
}

.fill {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 35%;

	background: var(--neutral-green);

	z-index: -1;
}
</style>
