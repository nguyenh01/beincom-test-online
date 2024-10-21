import { Button, Form, type FormProps, Input, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import BlockContainer from "@src/pages/components/Shared/BlockContainer";
import { CreatePostRequest } from "@src/types/api";
import { FunctionComponent } from "react";
import { useForm } from "antd/lib/form/Form";

const { TextArea } = Input;
const { Text } = Typography;

interface FieldType {
  title: string;
  content: string;
}

interface PostFormProps {
  onCreatePost: (payload: CreatePostRequest) => void;
  isPostLoading: boolean;
}

const PostForm: FunctionComponent<PostFormProps> = ({
  onCreatePost,
  isPostLoading,
}) => {
  const [form] = useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    onCreatePost(values);
    form.resetFields();
  };

  return (
    <BlockContainer>
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Post Title"
          name="title"
          rules={[{ required: true, message: "Please input your post title!" }]}
        >
          <Input
            className="w-full"
            size="large"
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Post Content"
          name="content"
          rules={[
            { required: true, message: "Please input your post content!" },
          ]}
        >
          <TextArea showCount />
        </Form.Item>
        <Form.Item className="!mb-0">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isPostLoading}
          >
            <div className="flex items-center gap-4">
              <Text className="!text-white font-medium">Post</Text>
              <SendOutlined />
            </div>
          </Button>
        </Form.Item>
      </Form>
    </BlockContainer>
  );
};

export default PostForm;
