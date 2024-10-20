import { GetCommentResponse } from "@src/types/api";
import axios from "axios";
import { API_URLS } from "@src/constants/api";

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
