import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { userStore } from '@bregenz-bewegt/client/common/stores';
import { createRequestInterceptor } from './interceptors';

const http = axios.create({
  baseURL: `${process.env['NX_API_BASE_URL']}/api`,
  timeout: 10000,
});

createRequestInterceptor(http);
createAuthRefreshInterceptor(
  http,
  async (error) => {
    const { refresh_token } = await userStore.getTokens();

    return http
      .post(
        '/auth/refresh',
        {},
        {
          headers: {
            authorization: `Bearer ${refresh_token}`,
          },
        }
      )
      .then(async (response) => {
        await userStore.setTokens(response.data);
        error.response.config.headers['authorization'] =
          'Bearer ' + response.data.access_token;
        return Promise.resolve();
      })
      .catch(async (error) => {
        await userStore.removeTokens();
        return Promise.reject(error);
      });
  },
  { statusCodes: [401] }
);
// createResponseInterceptor(http);

export { http };
