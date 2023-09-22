/** Services */
import { API } from "@/services/config"

export const fetchActiveNamespaces = async () => {
	try {
		const url = new URL(`${API}/namespace/active`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
