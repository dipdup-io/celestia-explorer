<script setup>
/** API */
import { search } from "@/services/api/search"

const router = useRouter()

const searchTerm = ref("")
const inputRef = ref()

const isActive = ref(false)

let history = []
const showHistory = ref(false)

const handleClick = () => {
	inputRef.value.focus()
}

onMounted(() => {
	document.addEventListener("keydown", onKeydown)

	history = JSON.parse(localStorage.getItem("history"))
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
	showHistory.value = true
}

const handleBlur = () => {
	isActive.value = false
	showHistory.value = false
}

const handleEnter = (e) => {
	handleSearch()
}

const handleSearch = async () => {
	if (!searchTerm.value) return

	const { data } = await search(searchTerm.value)

	if (!data.value) {
		if (!isNaN(parseInt(searchTerm.value))) {
			saveToLocaleStorage("block", searchTerm.value)
			router.push(`/block/${searchTerm.value}`)
			return
		}
	} else {
		switch (data.value.type) {
			case "block":
				saveToLocaleStorage("block", data.value.result.height)
				router.push(`/block/${data.value.result.height}`)
				return

			case "tx":
				saveToLocaleStorage("tx", data.value.result.height)
				router.push(`/block/${data.value.result.height}`)
				return
		}
	}
}

const saveToLocaleStorage = (type, height) => {
	const history = JSON.parse(localStorage.getItem("history"))

	if (history) {
		/** max 5 items */
		localStorage.setItem("history", JSON.stringify([{ term: searchTerm.value, height, type }, ...history.slice(0, 4)]))
	} else {
		localStorage.setItem("history", JSON.stringify([{ term: searchTerm.value, height, type }]))
	}
}
</script>

<template>
	<Flex :class="$style.wrapper">
		<Flex @click="handleClick" align="center" justify="between" :class="[$style.container, isActive && $style.active]">
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
				<Icon
					v-if="searchTerm.length"
					@click="handleClear"
					name="close-circle"
					size="16"
					color="tertiary"
					:class="$style.clear_icon"
				/>
				<Icon @click="handleSearch" name="return" size="16" color="tertiary" :class="$style.enter_icon" />
			</Flex>
		</Flex>

		<Transition name="fastfade">
			<Flex v-if="showHistory && history" direction="column" gap="8" :class="$style.history_popup">
				<Text size="12" weight="600" color="tertiary">Search History</Text>

				<Flex direction="column" gap="2">
					<NuxtLink :to="`/block/${item.height}`" v-for="item in history">
						<Flex justify="between" :class="$style.item">
							<Flex align="center" gap="8" style="max-width: calc(100% - 20px)">
								<Icon
									:name="(item.type === 'block' && 'block') || (item.type === 'tx' && 'zap') || 'tag'"
									size="14"
									color="secondary"
								/>
								<Text size="13" weight="600" color="primary" :class="$style.term">{{ item.term }}</Text>
							</Flex>

							<Icon name="arrow-narrow-right" size="14" color="secondary" :class="$style.arrow_icon" />
						</Flex>
					</NuxtLink>
				</Flex>
			</Flex>
		</Transition>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
}

.container {
	width: 100%;
	height: 38px;

	cursor: text;
	border-radius: 8px;
	border: 2px solid var(--op-5);
	background: var(--app-background);

	padding: 0 6px 0 12px;

	transition: all 0.2s ease;
}

.container:hover {
	border: 2px solid var(--op-10);
}

.container.active {
	border: 2px solid var(--op-20);
}

.container.active .search_icon {
	fill: var(--txt-secondary);
}

.search_icon {
	transition: fill 0.2s ease;
}

.container input {
	width: 100%;

	font-size: 14px;
	line-height: 1.1;
	font-weight: 500;
	color: var(--txt-primary);
}

.container input::placeholder {
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

.history_popup {
	position: absolute;
	z-index: 1000;

	top: 46px;
	left: 0;
	right: 0;

	background: var(--card-background);
	border-radius: 8px;
	border: 2px solid var(--op-5);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 15%);

	padding: 12px 12px 4px 12px;

	.item {
		border-radius: 6px;
		cursor: pointer;

		padding: 8px;
		margin: 0 -8px;

		transition: all 0.2s ease;

		&:hover {
			background: var(--op-5);

			.arrow_icon {
				opacity: 1;
			}
		}

		.arrow_icon {
			opacity: 0;

			transition: opacity 0.2s ease;
		}

		.term {
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
}
</style>
