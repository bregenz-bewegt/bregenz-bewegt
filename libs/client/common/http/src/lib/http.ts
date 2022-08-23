import axios from 'axios';

console.log(process.env);

export const http = axios.create({
  baseURL: process.env['NX_API_BASE_URL'],
  timeout: 1000,
});
