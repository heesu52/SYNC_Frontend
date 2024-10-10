import axios, { AxiosError, isAxiosError } from 'axios';
import config from 'config/config';

export const publicInstance = axios.create({
  baseURL: config.backendUrl,
});

export const userApiInstance = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true,
});

export const projectApiInstance = axios.create({
  baseURL: config.backendProjectUrl,
  withCredentials: true,
});

userApiInstance.interceptors.response.use(
  (response) => response,
  async (axiosError: AxiosError) => {
    await catchJwtTokenError(axiosError);
  },
);

projectApiInstance.interceptors.response.use(
  (response) => response,
  async (axiosError: AxiosError) => {
    await catchJwtTokenError(axiosError);
  },
);

const catchJwtTokenError = async (axiosError: AxiosError) => {
  const originalRequest = axiosError.config;

  if (
    isAxiosError<{ message: string }>(axiosError) &&
    axiosError.response &&
    originalRequest
  ) {
    const { data } = axiosError.response;

    if (data.message.split(' ').slice(0, 2).join(' ') === 'JWT expired') {
      localStorage.clear();
      window.alert('토큰 유효기간 만료. 로그인 창으로 돌아갑니다.');
      window.location.href = '/login';
      return Promise.reject(axiosError);
    }
  }
  return null;
};

/*
  try {
  await axios.get(`${config.backendUrl}/user/api/info/v1`, {
    withCredentials: true,
  });
  return axios(originalRequest);
} catch (error) {
  if (isAxiosError<{ message: string }>(error) && error.response) {
    if (data.message === 'JWT expired') {
      window.alert('토큰 유효기간 만료. 로그인 창으로 돌아갑니다.');
      window.location.href = '/login';
    }
  }
  Promise.reject(error);
}
*/
