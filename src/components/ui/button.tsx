import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button className={`px-4 py-2 rounded-md text-white ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
