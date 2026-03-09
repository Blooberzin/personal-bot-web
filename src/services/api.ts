import axios from 'axios'

const api = axios.create({
  baseURL: 'https://personal-bot-api-production.up.railway.app'
})

export default api