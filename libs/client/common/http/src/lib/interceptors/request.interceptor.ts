import { userStore } from '@bregenz-bewegt/client/common/stores';
import { AxiosInstance } from 'axios';

export const createRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      const { access_token } = await userStore.getTokens();
      if (access_token) {
        if (config.headers) {
          config.headers['authorization'] =
            config.headers['authorization'] ?? `Bearer ${access_token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
