import React from "react";

interface CreateTokenModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTokenId: React.Dispatch<React.SetStateAction<string>>;
  setNewTokenPrice: React.Dispatch<React.SetStateAction<string>>;
  setNewTokenURI: React.Dispatch<React.SetStateAction<string>>;
  submit: () => void;
}

export const CreateTokenModal: React.FC<CreateTokenModalProps> = ({
  setShowModal,
  setNewTokenId,
  setNewTokenPrice,
  setNewTokenURI,
  submit,
}) => {
  const labelStyling =
    "text-gray-600 pl-1 mb-2 dark:text-gray-300 font-semibold text-md";
  const inputStyling =
    "my-2 p-3 w-full border-2 rounded-lg focus:border-primary focus:outline-none text-gray-600 font-normal text-sm";

  return (
    <div
      className={`fixed flex items-center justify-center w-screen h-screen inset-0 bg-black bg-opacity-50 z-50`}
    >
      {" "}
      <div
        data-aos="zoom-in-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/5 max-h-[90%] py-6 md:py-8 px-4 md:px-6 overflow-y-auto no-scrollbar relative"
      >
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h1 className="text-gray-600 font-bold md:text-xl">
            Create a new token
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-gray-600 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="w-full">
            <label htmlFor="" className={labelStyling}>
              Token ID
            </label>
            <input
              type="text"
              className={inputStyling}
              placeholder="Input your token ID"
              onChange={(e) => setNewTokenId(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Token URI
            </label>
            <input
              type="text"
              className={inputStyling}
              placeholder="Input your token URI"
              onChange={(e) => setNewTokenURI(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Token Price (ETH)
            </label>
            <input
              type="number"
              className={inputStyling}
              placeholder="Input your token price"
              onChange={(e) => setNewTokenPrice(e.target.value)}
              min={0}
            />
          </div>
          <button
            onClick={() => submit()}
            className="bg-primary hover:scale-105 duration-200 rounded-xl p-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
