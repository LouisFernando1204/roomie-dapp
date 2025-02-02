import React from "react";
import notFound from "../assets/notFound.png";

interface EmptyPageProps {
  title: string;
  text: string;
}

export const EmptyPage: React.FC<EmptyPageProps> = ({ title, text }) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img src={notFound} alt="" className="size-48 md:size-72" />
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {title}
          </h1>
          <p className="text-md md:text-xl text-center">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
