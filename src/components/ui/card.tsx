import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return <div className={`bg-white p-4 shadow-md rounded-lg ${className}`}>{children}</div>;
};

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div className="p-2">{children}</div>;
};
