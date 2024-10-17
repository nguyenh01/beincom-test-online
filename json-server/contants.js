export const UTF_8 = "utf-8";

export const DB_PATH_FILE = "./database.json";

export const PORT = 8080;

export const ZERO = 0;

export const ONE = 1;

export const TEN = 10;

export const JWT = {
  SECRET_KEY: "nguyen.dh",
  EXPIRES_IN: "1h",
  REFRESH_TOKEN_TYPE: "refresh",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MSG = {
  EMAIL_ALREADY: "Email already exist",
  INCORRECT_INFO: "Incorrect Email or Password",
  INVALID_TOKEN: "Invalid token",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  NO_PERMISSION: "You do not have permission to modify this resource.",
  POST_NOT_FOUND: "Post not found.",
  POST_SUCCESS: "Post updated successfully",
  COMMENT_NOT_FOUND: "Comment not found.",
  COMMENT_SUCCESS: "Comment updated successfully",
};

export const PAGINATION = {
  DEFAULT: 10,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
