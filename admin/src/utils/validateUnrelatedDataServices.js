import { SERVICES } from '../constants/unrelatedDataServices';

function validateUnrelatedDataServices(url = '') {
  for (const serviceName in SERVICES) {
    const service = SERVICES[serviceName];

    if (!url.includes(service?.url)) continue;
    return service;
  }
}

export default validateUnrelatedDataServices;