export const comma = (target, symbol = ",") => {
	if (!target) return 0

	let num = parseFloat(target)

	if (num % 1 === 0) {
		num = num.toFixed(0)
	} else {
		num = num.toFixed(2)
	}

	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol)
}

export const tia = (amount) => {
	if (!amount || !parseInt(amount)) return 0
	return (parseInt(amount) / 1000000).toFixed(2)
}
