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
    <div className="-mx-10 text-darkOrange border-b border-n-6 shadow-xl">
      <nav className="bg-secondary fixed w-full z-20 top-0 start-0 border-b border-amber-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-6 md:py-4">
          {/* Logo */}
          <a href="/" className="flex flex-row gap-2 items-center space-x-3 rtl:space-x-reverse">
            <img src="\images\roomie_logo.jpg" alt="plug" className="h-12" />
            <span className="hidden md:block self-center text-2xl font-semibold whitespace-nowrap italic">Roomie</span>
          </a>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Connect Wallet Button */}
            <button
              onClick={() => {
                handleConnect();
              }}
              className="relative bg-darkOrange p-2 md:p-3.5 rounded-xl hover:scale-105 duration-200 flex items-center gap-2 shadow-md"
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

            {/* Mobile Menu Toggle */}
            <button
              data-collapse-toggle="navbar-sticky" // Matches the ID of the hidden menu
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky" // Matches the data-collapse-toggle value
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-secondary md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              {isUser
                ? userNavList.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.url}
                      className="block py-2 px-3 text-darkOrange rounded hover:bg-brightYellow md:hover:bg-transparent md:hover:text-brightYellow md:p-0"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
                : adminNavList.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.url}
                      className="block py-2 px-3 text-darkOrange rounded hover:bg-amber-900 md:hover:bg-transparent md:hover:text-brightYellow md:p-0"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              <li>
                <h1
                  onClick={() => setIsUser(!isUser)}
                  className="block py-2 px-3 text-darkOrange rounded hover:bg-amber-900 md:hover:bg-transparent md:hover:text-brightYellow md:p-0 cursor-pointer"
                >
                  {isUser ? "Admin" : "User"}
                </h1>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
