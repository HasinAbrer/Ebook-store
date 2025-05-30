import axios from "axios";Add commentMore actions

const client = axios.create({
  baseURL: "http://localhost:8989",
});

export default client;