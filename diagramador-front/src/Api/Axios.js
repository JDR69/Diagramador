import axios from 'axios';
import Auth from './Auth';

const api = axios.create({
  baseURL: '/api', // Cambia esto si tu backend está en otro host/puerto
  headers: {
    'Content-Type': 'application/json',
  // Puedes agregar aquí el token si usas autenticación
  // 'Authorization': `Bearer ${Auth.getToken()}`
  },
});

// Puedes agregar interceptores aquí si necesitas manejar tokens o errores globales
// api.interceptors.request.use(config => { ... });

export default api;
