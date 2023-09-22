<template>
	<Flex tag="footer" justify="center" :class="$style.wrapper">
		<Flex align="center" justify="between" wide :class="$style.container">
			<Flex align="center" gap="8">
				<Icon name="logo" size="14" color="tertiary" />
				<Text size="13" weight="500" color="secondary">Inblob</Text>
				<Text size="13" weight="500" color="tertiary"> / Celestia Explorer, {{ new Date().getFullYear() }}</Text>
			</Flex>

			<Flex align="center" gap="16">
				<NuxtLink to="/blocks" :class="$style.link">
					<Text size="12" weight="500" color="tertiary"> Blocks </Text>
				</NuxtLink>
				<NuxtLink to="/transactions" :class="$style.link">
					<Text size="12" weight="500" color="tertiary"> Transactions </Text>
				</NuxtLink>
				<NuxtLink to="/namespaces" :class="$style.link">
					<Text size="12" weight="500" color="tertiary"> Namespaces </Text>
				</NuxtLink>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	border-top: 2px solid var(--op-5);
}

.container {
	max-width: var(--base-width);

	padding: 24px 0;
	margin: 0 24px;
}

.link {
	& span {
		transition: all 0.2s ease;

		&:hover {
			color: var(--txt-primary);
		}
	}
}

@media (max-width: 600px) {
	.container {
		flex-direction: column;
		gap: 12px;
	}
}
</style>
