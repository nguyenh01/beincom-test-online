import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@src/constants/cookies";
import { API_ENDPOINT } from "@src/constants/api";
import { refreshToken } from "@src/services/auth.service";

const AUTHORIZATION_TEXT = "Authorization";
const UNAUTHORIZED_STATUS = 401;

const getToken = (token: string) => `Bearer ${token}`;

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers[AUTHORIZATION_TEXT] = getToken(token);
    }
    return config;
  },
  (error) => Promise.reject(new Error(error)),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === UNAUTHORIZED_STATUS &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      let retries = 3; // Number of retries

      while (retries > 0) {
        try {
          const newAccessToken = await refreshToken();

          if (newAccessToken && originalRequest.headers) {
            originalRequest.headers[AUTHORIZATION_TEXT] =
              getToken(newAccessToken);
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          retries -= 1;
        }
      }

      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      window.location.href = "/login";
    }

    return Promise.reject(new Error(error));
  },
);

export default axiosClient;
