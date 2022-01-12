import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "../utils";

const axiosOptions: AxiosRequestConfig = {
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  // withCredentials: true,
};

const request = axios.create(axiosOptions);

export const makeGetRequest = <T = any>(url: string, options: AxiosRequestConfig = {}) => {
  return request.get<T>(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getCookie("enerflo_token")}`,
    },
    withCredentials: true,
  });
};

export const makeUnauthenticatedGetRequest = <T = any>(url: string, options: AxiosRequestConfig = {}) => {
  return request.get<T>(url, options);
};

export const makePostRequest = <T, R = any>(url: string, payload: T, options: AxiosRequestConfig = {}) => {
  return request.post<T, AxiosResponse<R>>(url, payload, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getCookie("enerflo_token")}`,
    },
    withCredentials: true,
  });
};

export const makeDeleteRequest = <T, R = any>(url: string, options: any = {}) => {
  return request.delete<T, AxiosResponse<R>>(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getCookie("enerflo_token")}`,
    },
    withCredentials: true,
  });
};
