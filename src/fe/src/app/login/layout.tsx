import { Metadata } from "next";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { roboto } from "@src/app/fonts";

export const metadata: Metadata = {
  title: "Login",
  description: "User Login",
};

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: Readonly<LoginLayoutProps>) => {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
};

export default LoginLayout;
