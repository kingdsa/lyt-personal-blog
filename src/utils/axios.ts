import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { kDebug } from "./index";
import type { AxiosRequestConfig } from "axios";
import { CUSTOM_HEADERS } from './constants';
import { useMessage } from 'naive-ui';

// 创建 axios 实例
const service = axios.create({
  baseURL: kDebug ? import.meta.env.VITE_PROXY_API : import.meta.env.VITE_APP_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { ...CUSTOM_HEADERS },
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    // 如果 Authorization 设置为 no-auth，则不携带 Token，用于登录、刷新 Token 等接口
    if (config.headers.Authorization != "no-auth" && accessToken) {
      config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  }
  // (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {

    // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
    if (response.config.responseType === "blob") {
      return response;
    }

    if (response.config.headers.Authorization === "no-auth") {
      return response;
    }

    /* 确保 businessResponse 格式 */
    if (response.data == null) {
      return {
        code: 200,
        msg: "无业务标准响应数据",
        data: null,
      };
    } else if (response.data.code == null && response.data.data == null) {
      return {
        code: 200,
        msg: "",
        data: response.data,
      };
    }

    return response.data;

  },

  async (error: any) => {
    let message: string = "系统错误";
    let type: "error" | "success" | "warning" | "info" = "error";
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      if (error.response.status === 401) {
        useMessage().error("您的会话已过期，请重新登录");
        return { code: 401, msg: "登录过期" };
      }

      switch (error.response.status) {
        case 400:
          message = error.response.data.Message || error.response.data.error_description;
          type = "error";
          break;
        case 403: // token 没有权限操作
          message = "您没有操作权限";
          type = "warning";
          break;
        case 413:
          message = "您上传的文件过大,请压缩文件再试试";
          type = "warning";
          break;
        case 429:
          message = "请求过多，请稍后再试";
          type = "warning";
          break;
        case 500:
          message = error.response.data.message || error.response.data.Message;
          type = "warning";
          break;
      }
    } else if (error.request) {
      console.warn(error);
      message = "网络异常";
      type = "error";
    } else {
      if (error.message.includes("timeout")) {
        message = "请求超时, 请重试!";
        type = "warning";
      } else {
        message = error.message || "未知错误";
        type = "error";
      }
    }

    // ElNotification({
    //   message,
    //   type,
    // });
    useMessage().error(message);

    return { code: 4000, msg: message };
  }
);

const request = {
  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return service.get<T, ServerResult<T>>(url, config);
  },
  post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.post<T, ServerResult<T>>(url, data, config);
  },
  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.put<T, ServerResult<T>>(url, data, config);
  },
  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return service.delete<T, ServerResult<T>>(url, config);
  },
  patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.patch<T, ServerResult<T>>(url, data, config);
  },
  postForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.postForm<T, ServerResult<T>>(url, data, config);
  },
  putForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.putForm<T, ServerResult<T>>(url, data, config);
  },
  patchForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.patchForm<T, ServerResult<T>>(url, data, config);
  },
};

export default request;
export const httpClient = service;
