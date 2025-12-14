import axiosClient from './axiosClient'

export const generateInitial = async (formData) => {
  // POST to /generate-initial with FormData { image, concept }
  return axiosClient.post('/generate-initial', formData)
}

export const getStatus = async (jobId) => {
  // GET /status/{job_id}
  return axiosClient.get(`/status/${jobId}`)
}

export const getResults = async (jobId) => {
  // GET /results/{job_id}
  return axiosClient.get(`/results/${jobId}`)
}

export const downloadImage = async (imageUrl) => {
  // simple GET to retrieve image blob
  return axiosClient.get(imageUrl, { responseType: 'blob' })
}

export default {
  generateInitial,
  getStatus,
  getResults,
  downloadImage
}
