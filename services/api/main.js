/** Services */
import { API } from "@/services/config"

export const fetchHead = async () => {
	try {
		const data = await useFetch(`${API}/head`)
		return data
	} catch (error) {
		console.error(error)
	}
}
