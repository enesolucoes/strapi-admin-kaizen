import axios from 'axios';
import { auth } from '@strapi/helper-plugin';

const backInstance = axios.create({
  baseURL: CUSTOM_VARIABLES.URL_DISPATCH,
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
