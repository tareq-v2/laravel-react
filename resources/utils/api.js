// utils/api.js
import axios from 'axios';

export const fetchCsrfToken = async () => {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
    withCredentials: true, // Include cookies in the request
  });
};