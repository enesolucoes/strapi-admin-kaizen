import axios from 'axios';
import { auth } from '@strapi/helper-plugin';

import { storage, formatFilterWithEnterpriseId } from '../utils';

const url = (CUSTOM_VARIABLES.NODE_ENV === 'production')?
  'https://listagem-calculos.dailykaizenconsultoria.com.br' :
  'https://kaizen-house-hml-calc.enesolucoes.com.br'

const backInstance = axios.create({
  baseURL: url,
});

backInstance.interceptors.request.use(
  async config => {
    const enterprise = storage.getItem('enterprise');
    const enterpriseId = enterprise?.externalId;

    if (!enterpriseId) throw new Error('Empresa não identificada.');

    if (config?.method === 'get') {
      config.url = config.url + formatFilterWithEnterpriseId(enterpriseId, config?.url, false);
    }

    if (['post', 'put', 'patch'].includes(config.method)) {
      config.data.enterprise_id = enterpriseId;
    }

    const token = storage.getItem('jwtToken');

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
