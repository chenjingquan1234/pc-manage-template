import router from "../router";
import axios from "axios";
import { ElMessage } from "element-plus";

// axios.defaults.withCredentials = true;
// const BASE_URL = window.location.origin + '/dbvisitorsvc'

const { VITE_AXIOS_BASEURL, VITE_API_ENV } = import.meta.env;
//创建axios的一个实例
let instance = axios.create({
  baseURL: VITE_API_ENV === "dev" ? "/api" : window.location.origin,
  timeout: 60000, //设置超时
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    let token = localStorage.getItem("token") || "";
    if (token) {
      config.headers["token"] = JSON.parse(token);
    }
    // if (token) config.data.token = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    // console.log({ response });

    if ([2001, 4008, 4020, 4013, 4014].indexOf(response.data.retCode) != -1) {
      sessionStorage.clear();
      router.replace({
        path: "/login",
      });
      return response.data;
    }
    return response.data;
  },
  (error) => {
    console.log({ error });
    return Promise.reject(error);
  }
);

interface RequestMsg {
  errorMsg?: boolean;
  errorText?: string;
  successMsg?: boolean;
  successText?: string;
}

interface RequestConfig {
  msgConfig?: RequestMsg;
  showMsg?: boolean;
  headers?: Object;
  requestConfig?: Object;
}

const _request = async (
  method: string,
  url: string,
  params: object,
  config: RequestConfig = {
    msgConfig: {
      errorMsg: true,
      errorText: "",
      successMsg: false,
      successText: "",
    },
    showMsg: false,
    headers: {},
    requestConfig: {},
  }
): Promise<any> => {
  const { errorMsg, successMsg, successText = "" } = config?.msgConfig || {};
  const { showMsg } = config || {};
  const { headers = {}, requestConfig = {} } = config;
  try {
    let res = null;
    // 处理不同请求的入参形式
    switch (method) {
      case "post":
        res = await instance.post(url, params, {
          headers,
          ...requestConfig,
        });
        break;
      case "get":
        res = await instance.get(url, { params, headers });
        break;
    }

    const { retCode: retCode, retMessage: retMessage } = res as any;
    // 错误提示处理，这里只处理错误提示，逻辑还是需要在外层判断retCode
    if (retCode !== 0 && (showMsg || errorMsg)) {
      ElMessage({
        type: "error",
        message: retMessage,
      });

      return Promise.reject(res);
    }
    // 成功提示处理
    if (retCode == 0 && (showMsg || successMsg || successText)) {
      ElMessage({
        type: "success",
        message: successText || "操作成功",
      });
    }

    return res;
  } catch (err) {
    if (showMsg || errorMsg) {
      ElMessage({
        type: "error",
        message: JSON.stringify(err),
      });
    }
  }
};

export const post = async <T>(
  url: string,
  params: object,
  config: RequestConfig
): Promise<T> => {
  console.log(url + "-param=====", params);
  let data = await _request("post", url, params, config);
  console.log(url + "-resp=====", data);
  return data;
};

export const get = async <T>(
  url: string,
  params: object,
  config: RequestConfig
): Promise<T> => {
  console.log(url + "-param=====", params);

  const data = await _request("get", url, params, config);
  console.log(url + "-resp=====", data);

  return data;
};
