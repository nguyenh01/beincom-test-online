export const API_ENDPOINT = "http://localhost:8080";

const BASE_API = "/api";

const buildUrl = (path: string) => `${API_ENDPOINT}${BASE_API}${path}`;
export const API_URLS = {
  LOGIN: buildUrl("/login"),
  LOGOUT: buildUrl("/logout"),
  REFRESH_TOKEN: buildUrl("/refresh-token"),
  GET_POST: buildUrl("/posts"),
  CREATE_POST: buildUrl("/posts"),
  UPDATE_POST: (id: number) => buildUrl(`/posts/${id}`),
  GET_COMMENT: (postId: number) => buildUrl(`/posts/${postId}/comments`),
  CREATE_COMMENT: (postId: number) => buildUrl(`/posts/${postId}/comments`),
  UPDATE_COMMENT: (id: number) => buildUrl(`/comments/${id}`),
};
