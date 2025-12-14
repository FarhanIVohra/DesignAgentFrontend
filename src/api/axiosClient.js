import axios from 'axios'

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:8000'

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosClient
