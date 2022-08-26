import { userStore } from '@bregenz-bewegt/client/common/stores';
import { AxiosInstance } from 'axios';

export const createResponseInterceptor = (instance: AxiosInstance) => {
  const interceptor = instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      instance.interceptors.response.eject(interceptor);

      const { refresh_token } = await userStore.getTokens();

      return instance
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
          return instance(error.response.config);
        })
        .catch((error) => {
          userStore.removeTokens();
          return Promise.reject(error);
        })
        .finally(() => createResponseInterceptor(instance));
    }
  );
};
