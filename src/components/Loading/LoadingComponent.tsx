import React from "react";
import MainContainer from "../MainContainer/MainContainer";
import Loading from "./Loading";

const LoadingComponent = () => {
  return (
    <MainContainer className="mt-3 p-6">
      <div className="mt-5"></div>
      <Loading />
      <div className="px-3 -mt-6 mb-4">Loading, please wait...</div>
    </MainContainer>
  );
};

export default LoadingComponent;
