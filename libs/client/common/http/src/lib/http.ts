import axios from 'axios';
import {
  createResponseInterceptor,
  createRequestInterceptor,
} from './interceptors';

const http = axios.create({
  baseURL: process.env['NX_API_BASE_URL'],
  timeout: 10000,
});

createRequestInterceptor(http);
createResponseInterceptor(http);

export { http };
