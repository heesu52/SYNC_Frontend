import { Cookies } from 'react-cookie';

import { userApiInstance } from '@libs/axios/axios';
import axios, { AxiosError, AxiosResponse } from 'axios';
import config from 'config/config';

export const BASE_URL = config.backendUrl;

export interface User {
  userId: string;
  password: string;
  username: string;
}

interface APIResponse<Result> {
  result: Result;
  focus?: string;
  errorMessage?: string;
}

interface AxiosRes<ResponseType> {
  message: string;
  result: boolean;
  data: ResponseType;
}

interface GetUserInfoData {
  userId: string;
  username: string;
}

export const signupAPI = async ({
  userId,
  password,
  username,
}: User): Promise<APIResponse<string>> => {
  try {
    await axios.post(`${config.backendUrl}/signup`, {
      userId,
      password,
      username,
      email: 'example@gmail.com',
    });
    return { result: 'OK', focus: '', errorMessage: '' };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data.message === 'UserId is duplicated')
        return {
          result: 'OK',
          focus: 'userId',
          errorMessage: '입력된 아이디는 이미 가입된 상태입니다.',
        };
    }
    return { result: '', focus: '', errorMessage: '네트워크 에러' };
  }
};

export const loginAPI = async ({
  userId,
  password,
}: Omit<User, 'username'>): Promise<APIResponse<'OK' | 'error'>> => {
  try {
    const response = await axios.post(
      `${config.backendUrl}/login`,
      {},
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        params: {
          id: userId,
          password,
        },
      },
    );
    const authHeaders: string | null = response.headers.authorization;
    if (authHeaders) {

      const token = authHeaders.split(' ')[1];
      const cookies = new Cookies(null, { path: '/' });
      cookies.set('JWT_TOKEN', token, {
        maxAge: 1000 * 60 * 30,
      });
      return { result: 'OK', focus: '', errorMessage: '' };
    }
    return { result: 'OK', focus: '', errorMessage: '' };
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError && error.response) {
      if (error.response.data.message === '아이디가 잘못되었습니다.')
        return {
          result: 'error',
          focus: 'userId',
          errorMessage: '입력하신 아이디가 옳지 않습니다.',
        };
    }
    return { result: 'error', focus: '', errorMessage: '네트워크 오류' };
  }
};

export const getLoggedUserAPI = async () => {
  const response = (await userApiInstance.get(
    `${config.backendUrl}/user/api/info/v1`,
  )) as AxiosResponse<AxiosRes<GetUserInfoData>, any>;
  return { result: response.data.data, focus: '', errorMessage: '' };
};
