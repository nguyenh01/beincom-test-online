import { CreateCommentRequest, GetCommentResponse } from "@src/types/api";
import axios from "axios";
import { API_URLS } from "@src/constants/api";
import axiosClient from "@src/lib/axiosClient";

export const getComment = async (postId: number) => {
  try {
    const { data } = await axios.get<Array<GetCommentResponse>>(
      API_URLS.GET_COMMENT(postId),
    );
    return data;
  } catch (error) {
    throw (error as any).response.data.message;
  }
};

export const createComment = async (
  postId: number,
  payload: CreateCommentRequest,
) => {
  try {
    await axiosClient.post(API_URLS.CREATE_COMMENT(postId), payload);
  } catch (error) {
    throw (error as any)?.response?.data?.message;
  }
};
