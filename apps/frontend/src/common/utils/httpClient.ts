import axios from 'axios'
import { getTokenFromCookie } from './cookie';

const token = getTokenFromCookie();

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  ...(token && {
    headers: {
    Authorization: `Bearer ${token}`
  }
  })
})
