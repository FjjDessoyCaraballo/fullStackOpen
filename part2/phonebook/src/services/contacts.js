import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = nameObject => {
    const request = axios.post(baseUrl, nameObject)
    return request.then(response => response.data)
}

const deleteContact = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const patchContact = (id, updatedContact) => {
    debugger
    const request = axios.patch(`${baseUrl}/${id}`, updatedContact)
    return request.then(response => response.data)
}

export default { getAll, create, deleteContact, patchContact }