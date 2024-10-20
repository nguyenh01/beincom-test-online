import axios from "axios";
import { API_URLS } from "@src/constants/api";
import {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from "@src/types/api";
import Cookies from "js-cookie";
import {
  ACCESS_TOKEN,
  EXPIRES_ONE,
  EXPIRES_SEVEN,
  REFRESH_TOKEN,
} from "@src/constants/cookies";
import axiosClient from "@src/lib/axiosClient";

const setTokenCookie = (token: string) => {
  Cookies.set(ACCESS_TOKEN, token, { expires: EXPIRES_ONE });
};

const setRefreshTokenCookie = (token: string) => {
  Cookies.set(REFRESH_TOKEN, token, { expires: EXPIRES_SEVEN });
};

const clearToken = () => {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
};

export const login = async (payload: LoginPayload) => {
  try {
    const { data } = await axios.post<LoginResponse>(API_URLS.LOGIN, payload);
    const { accessToken, refreshToken } = data;
    setTokenCookie(accessToken);
    setRefreshTokenCookie(refreshToken);
    return data;
  } catch (error) {
    throw (error as any).response.data.message;
  }
};

export const logout = async () => {
  const refreshToken = Cookies.get(REFRESH_TOKEN);

  try {
    const { data } = await axiosClient.post<LogoutResponse>(API_URLS.LOGOUT, {
      refreshToken,
    });
    clearToken();
    return data;
  } catch (error) {
    throw (error as any).response.data.message;
  }
};

export const refreshToken = async () => {
  const refreshToken = Cookies.get(REFRESH_TOKEN);

  try {
    const { data } = await axios.post<RefreshTokenResponse>(
      API_URLS.REFRESH_TOKEN,
      {
        refreshToken,
      },
    );

    const { accessToken } = data;
    Cookies.set(ACCESS_TOKEN, accessToken, { expires: EXPIRES_ONE });

    return accessToken;
  } catch (error) {
    throw (error as any).response.data.message;
  }
};
