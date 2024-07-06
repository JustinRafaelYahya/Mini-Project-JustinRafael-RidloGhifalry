import React from "react";

const MainButton = (props) => {
  const { children, className } = props;
  return (
    <button
      className={`${className} bg-main-color rounded-md font-semibold px-6 py-4 mt-12 mb-6 text-white hover:scale-105 justify-center ease-in-out duration-300`}
    >
      {children}
    </button>
  );
};

export default MainButton;
