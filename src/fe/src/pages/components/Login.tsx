"use client";

import type { FormProps } from "antd";
import { Button, Flex, Form, Input, notification, Typography } from "antd";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@src/services/auth.service";
import { REDIRECT_PATH } from "@src/constants/redirection";

const { Title } = Typography;
const { Password } = Input;

interface FieldType {
  email: string;
  password: string;
}

const Login: FunctionComponent = () => {
  const router = useRouter();

  const { mutate: mutateLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      router.push(REDIRECT_PATH.HOME);
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error as string,
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    mutateLogin(values);
  };

  return (
    <Flex
      className="h-screen w-full p-3"
      align="center"
      vertical
    >
      <Title level={2}>Login</Title>
      <Form
        className="w-full lg:w-1/2"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            className="w-full"
            type="email"
            size="large"
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Password
            className="w-full"
            size="large"
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;
