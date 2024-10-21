export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface GetUserInfo {
  email: string;
}

export interface GetPostParams {
  limit?: number;
  page?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  email: string;
  createdAt: string;
}

export interface GetPostResponse {
  posts: Array<Post>;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export interface GetCommentResponse {
  id: number;
  postId: number;
  content: string;
  userId: number;
  email: string;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}
