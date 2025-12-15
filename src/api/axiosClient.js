import axios from 'axios'
import { BACKEND_URL } from './apiBase'

const baseURL = BACKEND_URL || 'http://localhost:8000'

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosClient
