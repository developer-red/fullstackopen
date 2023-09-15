import axios from "axios";

const getEntries = async () => {
    const response = await axios.get("http://localhost:3001/persons")
    return response.data
}

const postEntry = async (newPerson) => {
    const response = await axios.post("http://localhost:3001/persons", newPerson)
    return response.data
}

const deleteEntry = (id) => {
    return axios.delete(`http://localhost:3001/persons/${id}`)
}

const updateEntry = (id, newPhone) => {
    console.log(newPhone)
    axios.put(`http://localhost:3001/persons/${id}`, newPhone)
}

export default {
    getEntries, postEntry, deleteEntry, updateEntry
}