import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const create = async newObject => {
	const config = {
		headers: { Authorization: token },
	}

	const response = axios.post(baseUrl, newObject, config)
	return response.data
}

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject)
	return request.then(response => response.data)
}

// eslint-disable-next-line
export default {
	getAll,
	create,
	update,
	setToken,
}
