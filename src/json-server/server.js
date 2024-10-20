import fs from "fs";
import bodyParser from "body-parser";
import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import cors from "cors";
import {
  DB_PATH_FILE,
  ERROR_MSG,
  HTTP_STATUS,
  JWT,
  ONE,
  PAGINATION,
  PORT,
  TEN,
  UTF_8,
  ZERO,
} from "./contants.js";

const { SECRET_KEY, EXPIRES_IN, REFRESH_TOKEN_TYPE } = JWT;
const {
  OK,
  CREATED,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = HTTP_STATUS;
const {
  EMAIL_ALREADY,
  INCORRECT_INFO,
  INVALID_TOKEN,
  INVALID_REFRESH_TOKEN,
  NO_PERMISSION,
  POST_NOT_FOUND,
  POST_SUCCESS,
  COMMENT_NOT_FOUND,
  COMMENT_SUCCESS,
  LOGOUT_SUCCESS,
} = ERROR_MSG;
const { DEFAULT, DEFAULT_PAGE, DEFAULT_LIMIT } = PAGINATION;

const server = jsonServer.create();
const database = JSON.parse(fs.readFileSync(DB_PATH_FILE, UTF_8));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());
server.use(cors({ origin: "http://localhost:3000" }));

const createToken = (payload) =>
  jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error);
    return null;
  }
};

let invalidatedTokens = [];

const authenticate = (request, response, next) => {
  const authHeader = request.headers.authorization;
  const status = UNAUTHORIZED;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(status).json({ status, message: INVALID_TOKEN });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || invalidatedTokens.includes(token)) {
    response.status(status).json({ status, message: INVALID_TOKEN });
    return;
  }

  request.user = decoded;
  next();
};

const isLoginAuthenticated = ({ email, password }) =>
  database.users.findIndex(
    (user) => user.email === email && user.password === password,
  ) !== -ONE;

const isRegisterAuthenticated = ({ email }) =>
  database.users.findIndex((user) => user.email === email) !== -ONE;

server.post("/api/register", (request, response) => {
  const { email, password } = request.body;
  if (isRegisterAuthenticated({ email })) {
    response.status(UNAUTHORIZED).json({ message: EMAIL_ALREADY });
    return;
  }

  fs.readFile(DB_PATH_FILE, (error, data) => {
    if (error) {
      response.status(UNAUTHORIZED).json({ message: error });
      return;
    }
    data = JSON.parse(data.toString());

    const lastItemId = data.users[data.users.length - ONE].id;
    data.users.push({ id: lastItemId + ONE, email, password });
    fs.writeFile(DB_PATH_FILE, JSON.stringify(data), (error) => {
      if (error) {
        response.status(UNAUTHORIZED).json({ message: error });
      }
    });
  });
  const accessToken = createToken({ email, password });
  response.status(OK).json({ accessToken });
});

server.post("/api/login", (request, response) => {
  const { email, password } = request.body;

  if (!isLoginAuthenticated({ email, password })) {
    response.status(UNAUTHORIZED).json({ message: INCORRECT_INFO });
    return;
  }

  const accessToken = createToken({ email, password });
  const refreshToken = createToken({
    email,
    password,
    type: REFRESH_TOKEN_TYPE,
  });
  response.status(OK).json({ accessToken, refreshToken });
});

server.post("/api/logout", authenticate, (request, response) => {
  const { refreshToken } = request.body;

  const decoded = verifyToken(refreshToken);
  if (decoded && decoded.type === REFRESH_TOKEN_TYPE) {
    invalidatedTokens.push(refreshToken);
    response.status(OK).json({ message: LOGOUT_SUCCESS });
  } else {
    response.status(UNAUTHORIZED).json({ message: INVALID_REFRESH_TOKEN });
  }
});

server.post("/api/refresh-token", (request, response) => {
  const { refreshToken } = request.body;

  const decoded = verifyToken(refreshToken);
  console.log("decoded", decoded);
  if (decoded && decoded.type === REFRESH_TOKEN_TYPE) {
    const { email, password } = decoded;
    const accessToken = createToken({ email, password });
    response.status(OK).json({ accessToken });
    return;
  }
  response.status(UNAUTHORIZED).json({ message: INVALID_REFRESH_TOKEN });
});

server.get("/api/posts", authenticate, (request, response) => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = request.query;
  const pageNumber = parseInt(page, DEFAULT);
  const limitNumber = parseInt(limit, DEFAULT);

  fs.readFile(DB_PATH_FILE, (error, data) => {
    if (error) {
      response.status(INTERNAL_SERVER_ERROR).json({ message: error });
      return;
    }

    const posts = JSON.parse(data.toString()).posts;
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const startIndex = (pageNumber - ONE) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    const totalPosts = sortedPosts.length;
    const totalPages = Math.ceil(totalPosts / limitNumber);

    response.status(OK).json({
      posts: paginatedPosts,
      currentPage: pageNumber,
      totalPages,
      totalPosts,
    });
  });
});

server.post("/api/posts", authenticate, (request, response) => {
  const { title, content } = request.body;
  fs.readFile(DB_PATH_FILE, (error, data) => {
    if (error) {
      response.status(INTERNAL_SERVER_ERROR).json({ message: error });
      return;
    }
    const posts = JSON.parse(data.toString()).posts;
    const newPost = {
      id: posts.length > ZERO ? posts[posts.length - ONE].id + ONE : ONE,
      title,
      content,
      userId: request.user.id,
      email: request.user.email,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    fs.writeFile(DB_PATH_FILE, JSON.stringify(posts), (error) => {
      if (error) {
        response.status(INTERNAL_SERVER_ERROR).json({ message: error });
        return;
      }
      response.status(CREATED).json(newPost);
    });
  });
});

server.put("/api/posts/:id", authenticate, (request, response) => {
  const postId = parseInt(request.params.id);
  const { title, content } = request.body;
  const { decoded } = request.user;

  fs.readFile("./database.json", (error, data) => {
    if (error) {
      return response.status(INTERNAL_SERVER_ERROR).json({ message: error });
    }

    const posts = JSON.parse(data.toString()).posts;
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex === -ONE) {
      return response.status(NOT_FOUND).json({ message: POST_NOT_FOUND });
    }

    if (posts[postIndex].userId !== decoded.userId) {
      return response.status(FORBIDDEN).json({ message: NO_PERMISSION });
    }

    posts[postIndex].title = title || posts[postIndex].title;
    posts[postIndex].content = content || posts[postIndex].content;

    fs.writeFile("./database.json", JSON.stringify({ posts }), (error) => {
      if (error) {
        return response.status(INTERNAL_SERVER_ERROR).json({ message: error });
      }

      response.status(OK).json({ message: POST_SUCCESS });
    });
  });
});

server.get("/api/posts/:postId/comments", (request, response) => {
  const { postId } = request.params;

  fs.readFile("./database.json", (error, data) => {
    if (error) {
      response.status(INTERNAL_SERVER_ERROR).json({ message: error });
      return;
    }

    const comments = JSON.parse(data.toString()).comments;
    const sortedPosts = comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const postComments = sortedPosts.filter(
      (comment) => comment.postId === parseInt(postId, TEN),
    );

    response.status(OK).json(postComments);
  });
});

server.post(
  "/api/posts/:postId/comments",
  authenticate,
  (request, response) => {
    const { postId } = request.params;
    const { content } = request.body;

    fs.readFile("./database.json", (error, data) => {
      if (error) {
        response.status(INTERNAL_SERVER_ERROR).json({ message: error });
        return;
      }

      const comments = JSON.parse(data.toString()).comments;
      const newComment = {
        id:
          comments.length > ZERO
            ? comments[comments.length - ONE].id + ONE
            : ONE,
        postId: parseInt(postId, TEN),
        content,
        userId: request.user.id,
        createdAt: new Date().toISOString(),
      };

      comments.push(newComment);

      fs.writeFile("./database.json", JSON.stringify(comments), (error) => {
        if (error) {
          response.status(INTERNAL_SERVER_ERROR).json({ message: error });
          return;
        }
        response.status(CREATED).json(newComment);
      });
    });
  },
);

server.put("/api/comments/:id", (request, response) => {
  const commentId = parseInt(request.params.id);
  const { content } = request.body;
  const { decoded } = request.userId;

  fs.readFile("./database.json", (error, data) => {
    if (error) {
      return response.status(INTERNAL_SERVER_ERROR).json({ message: error });
    }

    const comments = JSON.parse(data.toString()).comments;
    const commentIndex = comments.findIndex(
      (comment) => comment.id === commentId,
    );

    if (commentIndex === -ONE) {
      return response.status(NOT_FOUND).json({ message: COMMENT_NOT_FOUND });
    }

    if (comments[commentIndex].userId !== decoded.userId) {
      return response.status(FORBIDDEN).json({ message: NO_PERMISSION });
    }

    comments[commentIndex].content = content || comments[commentIndex].content;

    fs.writeFile("./database.json", JSON.stringify({ comments }), (error) => {
      if (error) {
        return response.status(INTERNAL_SERVER_ERROR).json({ message: error });
      }

      response.status(OK).json({ message: COMMENT_SUCCESS });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
