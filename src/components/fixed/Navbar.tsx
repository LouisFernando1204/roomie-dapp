/* eslint-disable react/prop-types */
import React from "react";
import { userNavList } from "../../utils/list";
import { adminNavList } from "../../utils/list";
import { Link } from "react-router-dom";
import { truncate } from "../../utils/helper";

interface NavbarProps {
  connectedAddress: string | undefined;
  handleConnect: () => void;
  isUser: boolean;
  setIsUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  connectedAddress,
  handleConnect,
  setIsUser,
  isUser,
}) => {
  return (
    <div className="max-w-screen text-primary mt-4 mb-12">
      <div className="flex items-center justify-between px-6 py-6 md:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <span className="hidden md:block text-2xl font-bold">Roomie</span>
        </a>

        {/* Navigation Links (Centered) */}
        <div className="hidden md:flex justify-center gap-10">
          {isUser
            ? userNavList.map((item, _) => (
                <div className="font-semibold">
                  <Link to={item.url} className="cursor-pointer">
                    {item.title}
                  </Link>
                </div>
              ))
            : adminNavList.map((item, _) => (
                <div className="font-semibold">
                  <Link to={item.url} className="cursor-pointer">
                    {item.title}
                  </Link>
                </div>
              ))}
          <h1
            onClick={() => setIsUser(!isUser)}
            className="font-semibold cursor-pointer"
          >
            {isUser ? "Admin" : "User"}
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              handleConnect();
            }}
            className="relative bg-primary p-2 md:p-3.5 rounded-xl hover:scale-105 duration-200 flex items-center gap-2 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-secondary"
            >
              <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
            </svg>
            <h1 className="font-semibold text-secondary">
              {connectedAddress
                ? truncate(connectedAddress, 4, 4, 11)
                : "Connect Wallet"}
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
