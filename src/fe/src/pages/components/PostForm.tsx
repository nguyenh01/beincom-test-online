import { Button, Form, Input, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import BlockContainer from "@src/pages/components/Shared/BlockContainer";

const { TextArea } = Input;
const { Text } = Typography;

interface FieldType {
  title: string;
  content: string;
}

const PostForm = () => {
  return (
    <BlockContainer>
      <Form
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Post Title"
          name="title"
          rules={[{ required: true, message: "Please input your post title!" }]}
        >
          <Input
            className="w-full"
            type="email"
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
