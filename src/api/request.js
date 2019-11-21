import axios from "axios";

const isDev = true;

axios.defaults.baseURL = url;
axios.defaults.timeout = 50000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// Interceptors
// request interceptor
axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

// response interceptor
axios.interceptors.response.use(
  function(response) {
    const { status, data } = response;
    if (status === 200) {
      return data;
    } else {
      // todo: 处理其他的状态码
      console.log(response);
      return [];
    }
  },
  function(error) {
    return Promise.reject(error);
  },
);

export const postApi = (url, params) => {
  return axios
    .post(url, params, isDev ? { withCredentials: true } : {})
    .then((data) => data);
};
export const getApi = (url, params) => {
  return axios
    .get(
      url,
      isDev ? { params: params, withCredentials: true } : { params: params },
    )
    .then((data) => data);
};

