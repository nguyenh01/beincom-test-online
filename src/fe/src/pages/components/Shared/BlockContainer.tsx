import { FunctionComponent, HTMLAttributes, PropsWithChildren } from "react";

const BlockContainer: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white p-8 rounded-lg shadow-md max-w-md w-full mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlockContainer;
