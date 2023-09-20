<script setup>
/** API */
import { search } from "@/services/api/search"

const router = useRouter()

const searchTerm = ref("")
const inputRef = ref()

const isActive = ref(false)

const handleClick = () => {
	inputRef.value.focus()
}

onMounted(() => {
	document.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
	document.removeEventListener("keydown", onKeydown)
})

const onKeydown = (e) => {
	if (e.code === "Escape" && isActive.value) {
		inputRef.value.blur()
	}

	if (e.code === "Slash" && !isActive.value) {
		inputRef.value.focus()
		e.preventDefault()
	}
}

const handleClear = () => {
	inputRef.value.blur()

	searchTerm.value = ""
}

const handleFocus = () => {
	isActive.value = true
}

const handleBlur = () => {
	isActive.value = false
}

const handleEnter = (e) => {
	handleSearch()
}

const handleSearch = async () => {
	if (!searchTerm.value) return

	const { data } = await search(searchTerm.value)

	if (!data.value) {
		if (!isNaN(parseInt(searchTerm.value))) {
			router.push(`/block/${searchTerm.value}`)
			return
		}
	} else {
		switch (data.value.type) {
			case "block":
				router.push(`/block/${data.value.result.height}`)
				return

			case "tx":
				router.push(`/block/${data.value.result.height}`)
				return
		}
	}
}
</script>

<template>
	<Flex @click="handleClick" align="center" justify="between" :class="[$style.wrapper, isActive && $style.active]">
		<Flex align="center" gap="8" wide>
			<Icon name="search" size="16" color="support" :class="$style.search_icon" />

			<input
				ref="inputRef"
				v-model="searchTerm"
				@focus="handleFocus"
				@blur="handleBlur"
				@keydown.enter="handleEnter"
				placeholder="Find transaction or block"
			/>
		</Flex>

		<Flex align="center" gap="4">
			<Icon v-if="searchTerm.length" @click="handleClear" name="close-circle" size="16" color="support" :class="$style.clear_icon" />
			<Icon @click="handleSearch" name="return" size="16" color="tertiary" :class="$style.enter_icon" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 100%;
	height: 38px;

	cursor: text;
	border-radius: 8px;
	border: 2px solid var(--op-5);
	background: var(--app-background);

	padding: 0 6px 0 12px;

	transition: all 0.2s ease;
}

.wrapper:hover {
	border: 2px solid var(--op-10);
}

.wrapper.active {
	border: 2px solid var(--op-20);
}

.wrapper.active .search_icon {
	fill: var(--txt-secondary);
}

.search_icon {
	transition: fill 0.2s ease;
}

.wrapper input {
	width: 100%;

	font-size: 14px;
	line-height: 1.1;
	font-weight: 500;
	color: var(--txt-primary);
}

.wrapper input::placeholder {
	color: var(--txt-support);
}

.clear_icon {
	box-sizing: content-box;
	cursor: pointer;
	border-radius: 4px;

	padding: 4px 6px;

	transition: fill 0.2s ease;

	&:hover {
		fill: var(--txt-secondary);
		background: var(--op-5);
	}

	&:active {
		fill: var(--txt-primary);
		background: var(--op-10);
	}
}

.enter_icon {
	box-sizing: content-box;
	cursor: pointer;
	border-radius: 4px;

	padding: 4px 6px;

	transition: fill 0.2s ease;

	&:hover {
		fill: var(--txt-secondary);
		background: var(--op-5);
	}

	&:active {
		fill: var(--txt-primary);
		background: var(--op-10);
	}
}
</style>
