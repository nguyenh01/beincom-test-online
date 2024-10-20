import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { roboto } from "@src/app/fonts";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "@src/styles/globals.scss";
import ReactQueryClientProvider from "@src/lib/ReactQueryClientProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={roboto.className}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
};

export default RootLayout;
