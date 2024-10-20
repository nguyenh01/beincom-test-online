"use client";

import { Fragment, FunctionComponent } from "react";
import { Button, Spin, Typography } from "antd";
import BlockContainer from "@src/pages/components/Shared/BlockContainer";
import PostForm from "@src/pages/components/PostForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPost } from "@src/services/post.service";
import Post from "@src/pages/components/Post";
import { logout } from "@src/services/auth.service";
import { useRouter } from "next/navigation";
import { REDIRECT_PATH } from "@src/constants/redirection";

const { Title } = Typography;

const PostHome: FunctionComponent = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", { limit: 5 }],
      queryFn: getPost,
      getNextPageParam: ({ totalPages, currentPage }) =>
        totalPages !== currentPage ? currentPage + 1 : undefined,
    });

  const handleLogoutClick = async () => {
    await logout();
    router.push(REDIRECT_PATH.LOGIN);
  };

  return (
    <div className="h-screen overflow-y-scroll bg-gray-100 p-3 flex items-center flex-col">
      <BlockContainer>
        <div className="flex items-center justify-between mb-3">
          <Title
            level={3}
            className="text-gray-800m !mb-0"
          >
            POST
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
      <PostForm />
      {data?.pages?.map((posts, i) => (
        <Fragment key={i}>
          {posts.posts.map((post) => (
            <Post
              key={post.id}
              post={post}
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
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
      </Button>
    </div>
  );
};

export default PostHome;
