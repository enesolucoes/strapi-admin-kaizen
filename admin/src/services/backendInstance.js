import axios from 'axios';
import { auth } from '@strapi/helper-plugin';

const url = (CUSTOM_VARIABLES.NODE_ENV === 'production')? 
  'https://listagem-calculos.dailykaizenconsultoria.com.br' :
  'https://kaizen-house-hml-calc.enesolucoes.com.br'

const backInstance = axios.create({
  baseURL: url,
});

const token = JSON.parse(sessionStorage.getItem('jwtToken'))

backInstance.interceptors.request.use(
  async config => {
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

backInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      auth.clearAppStorage();
      window.location.reload();
    }

    throw error;
  }
);

export { backInstance };
