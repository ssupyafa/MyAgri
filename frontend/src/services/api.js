import axios from 'axios'
import { savePrediction, getAllPredictions } from './db'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const predict = async (type, data) => {
  if (!navigator.onLine) {
    console.warn('Offline mode: Using local storage')
    const localResult = {
      type,
      input: data,
      result: { status: 'offline', message: 'Data saved locally. Will sync when online.' },
      timestamp: new Date().toISOString(),
    }
    await savePrediction(localResult)
    return localResult
  }

  try {
    const response = await api.post(`/${type}`, data)
    const result = {
      type,
      input: data,
      result: response.data,
      timestamp: new Date().toISOString(),
    }
    await savePrediction(result)
    return result
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getHistory = async () => {
  if (!navigator.onLine) {
    return getAllPredictions()
  }
  try {
    const response = await api.get('/dashboard')
    return response.data.logs
  } catch (error) {
    return getAllPredictions()
  }
}

export default api