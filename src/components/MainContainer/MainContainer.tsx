import React, { ReactNode } from "react";

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}

const MainContainer = (props: MainContainerProps) => {
  return (
    <div className={`bg-white rounded p-2 md:p-3 ${props.className}`}>
      {props.children}
    </div>
  );
};

export default MainContainer;
