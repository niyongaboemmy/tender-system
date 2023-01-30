import React, { useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";

const Failed = (props: { message: string; onClose: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      props.onClose();
    }, 6000);
  });
  return (
    <div>
      <div
        onClick={props.onClose}
        className="flex flex-row items-center justify-between gap-8 p-2 w-full bg-red-100 rounded-md animate__animated animate__bounceInUp cursor-pointer group-hover:"
      >
        <div className="flex flex-row items-center gap-2">
          <div>
            <BsCheckCircleFill className="text-3xl text-red-600" />
          </div>
          <div className="font-bold">{props.message}</div>
        </div>
        <div>
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-50 text-red-700 group-hover:bg-red-700 group-hover:text-white cursor-pointer">
            <MdClose className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Failed;
