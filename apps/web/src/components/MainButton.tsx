import React, { ReactNode } from 'react';

interface MainButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const MainButton: React.FC<MainButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      className={`${className} rounded-md font-semibold px-6 py-4 mt-12 mb-6 text-white  justify-center `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MainButton;
