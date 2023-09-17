/** Services */
import { API } from "@/services/config"

export const search = async (query) => {
	try {
		const data = await useFetch(`${API}/search?query=${query}`)
		return data
	} catch (error) {
		console.error(error)
	}
}
