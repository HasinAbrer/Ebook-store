\lenovo\Downloads\Project-350\Frontend\src\utils\axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8989',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default api;