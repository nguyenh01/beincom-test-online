import axiosClient from "@src/lib/axiosClient";
import {
  CreatePostRequest,
  GetPostParams,
  GetPostResponse,
} from "@src/types/api";
import { API_URLS } from "@src/constants/api";
// eslint-disable-next-line import/named
import { QueryFunctionContext } from "@tanstack/react-query";

export const getPost = async ({
  queryKey,
  pageParam = 1,
}: QueryFunctionContext<[string, GetPostParams?]>) => {
  const [, params] = queryKey;
  const { limit = 5 } = params || {};

  try {
    const { data } = await axiosClient.get<GetPostResponse>(API_URLS.GET_POST, {
      params: { page: pageParam, limit },
    });
    return data;
  } catch (error) {
    throw (error as any)?.response?.data?.message;
  }
};

export const createPost = async (payload: CreatePostRequest) => {
  try {
    await axiosClient.post(API_URLS.CREATE_POST, payload);
  } catch (error) {
    throw (error as any)?.response?.data?.message;
  }
};
