import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:51",
});

export default client;