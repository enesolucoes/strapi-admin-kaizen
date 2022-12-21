import axios from 'axios';
import { auth } from '@strapi/helper-plugin';

import { formatUrlWithNewFilter, validateUnrelatedDataServices } from '../../utils';

const instance = axios.create({
  baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
});

instance.interceptors.request.use(
  async config => {
    const isAnUnrelatedDataServices = validateUnrelatedDataServices(config?.url);

    if (config?.method === 'post' && isAnUnrelatedDataServices) {
      const { query_column } = isAnUnrelatedDataServices;
      config.url = config?.url + formatUrlWithNewFilter(query_column, "$null", true, config?.url);
    }

    config.headers = {
      Authorization: `Bearer ${auth.getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    // whatever you want to do with the error
    if (error?.response?.status === 401) {
      auth.clearAppStorage();
      window.location.reload();
    }

    throw error;
  }
);

export default instance;
