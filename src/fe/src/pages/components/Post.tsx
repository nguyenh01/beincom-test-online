import { FunctionComponent } from "react";
import BlockContainer from "@src/pages/components/Shared/BlockContainer";
import { CommentOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Spin, Typography } from "antd";
import { Post as IPost } from "@src/types/api";
import { formatDate } from "@src/utils/common";
import { useQuery } from "@tanstack/react-query";
import { getComment } from "@src/services/comment.service";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface PostProps {
  post: IPost;
}

const Post: FunctionComponent<PostProps> = ({ post }) => {
  const { id } = post;
  const { data: comments, isFetching } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getComment(id),
  });

  return (
    <BlockContainer>
      <div className="mb-3">
        <Title
          className="!mb-1"
          level={5}
        >
          {post.email}
        </Title>
        <Text className="!text-gray-500">{formatDate(post.createdAt)}</Text>
      </div>
      <div className="mb-3 flex flex-col gap-2">
        <Text className="!text-gray-500">
          Title: <Text className="!text-black">{post.title}</Text>
        </Text>
        <Text className="!text-gray-500">
          Content: <Text className="!text-black">{post.content}</Text>
        </Text>
      </div>
      <div className="w-full flex justify-end">
        <div className="flex items-center gap-2">
          <CommentOutlined />
          {isFetching ? (
            <Spin spinning={isFetching} />
          ) : (
            <Text>
              {comments?.length || 0} Comment{comments?.length !== 1 ? "s" : ""}
            </Text>
          )}
        </div>
      </div>
      <Divider className="!my-3" />
      <Title
        className="!mb-0 text-center"
        level={5}
      >
        Comment
      </Title>
      <Divider className="!my-3" />
      {isFetching ? (
        <Spin
          className="w-full"
          spinning={isFetching}
        />
      ) : (
        <>
          {comments?.map(({ id, email, createdAt, content }) => (
            <div
              key={id}
              className="w-full bg-gray-100 p-2 mb-3 rounded-2xl flex flex-col gap-2"
            >
              <Title
                className="!mb-0"
                level={5}
              >
                {email} -{" "}
                <Text className="!text-gray-300">{formatDate(createdAt)}</Text>
              </Title>
              <Text>{content}</Text>
            </div>
          ))}
        </>
      )}
      <TextArea showCount />
      <Button
        className="w-full mt-6"
        size="large"
        type="primary"
      >
        Comments
      </Button>
    </BlockContainer>
  );
};

export default Post;
