"use client";

import { Fragment, FunctionComponent, useCallback, useRef } from "react";
import { Button, notification, Spin, Typography } from "antd";
import BlockContainer from "@src/pages/components/Shared/BlockContainer";
import PostForm from "@src/pages/components/PostForm";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createPost, getPost } from "@src/services/post.service";
import Post from "@src/pages/components/Post";
import { logout } from "@src/services/auth.service";
import { useRouter } from "next/navigation";
import { REDIRECT_PATH } from "@src/constants/redirection";
import { CreateCommentRequest, CreatePostRequest } from "@src/types/api";
import { createComment } from "@src/services/comment.service";

const { Title } = Typography;

interface PostHome {
  email: string;
}

const PostHome: FunctionComponent<PostHome> = ({ email }) => {
  const router = useRouter();
  const postRef = useRef<HTMLDivElement>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch: refetchPostList,
  } = useInfiniteQuery({
    queryKey: ["posts", { limit: 5 }],
    queryFn: getPost,
    getNextPageParam: ({ totalPages, currentPage }) =>
      totalPages !== currentPage ? currentPage + 1 : undefined,
  });

  const { mutate: mutatePost, isLoading: isPostLoading } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: createPost,
    onSuccess: () => {
      notification.success({
        message: "Success",
        description: "Create Post Successfully",
      });
      refetchPostList();
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error as string,
      });
    },
  });

  const { mutate: mutateComment, isLoading: isCommentLoading } = useMutation({
    mutationKey: ["createComment"],
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: number;
      payload: CreateCommentRequest;
    }) => createComment(postId, payload),
    onSuccess: () => {
      notification.success({
        message: "Success",
        description: "Create Comment Successfully",
      });
      refetchPostList();
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error as string,
      });
    },
  });

  const handlePostCreate = useCallback((payload: CreatePostRequest) => {
    mutatePost(payload);
  }, []);

  const handleCommentCreate = useCallback(
    (postId: number, payload: CreateCommentRequest) => {
      mutateComment({ postId, payload });
    },
    [],
  );

  const handleLogoutClick = async () => {
    await logout();
    router.push(REDIRECT_PATH.LOGIN);
  };

  return (
    <div className="h-screen overflow-y-scroll bg-gray-100 p-3 flex items-center flex-col">
      <BlockContainer>
        <div className="flex items-center justify-between mb-3">
          <Title
            level={4}
            className="text-gray-800m !mb-0"
          >
            {email}
          </Title>
          <Button
            type="primary"
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </div>
        <p className="text-gray-700 mt-2"> Web Developer</p>
      </BlockContainer>
      <PostForm
        onCreatePost={handlePostCreate}
        isPostLoading={isPostLoading}
      />
      {data?.pages?.map((posts, i) => (
        <Fragment key={i}>
          {posts.posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onCommentPost={handleCommentCreate}
              isCommentLoading={isCommentLoading}
            />
          ))}
        </Fragment>
      ))}
      <Spin
        className="w-full mb-3"
        spinning={isFetching && !isFetchingNextPage}
      />
      <Button
        type="primary"
        loading={isFetchingNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {hasNextPage ? "Load More" : "Nothing more to load"}
      </Button>
    </div>
  );
};

export default PostHome;
