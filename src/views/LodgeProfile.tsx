import React, { useState } from "react";

interface LodgeProfileProps {
  connectedAccount: string | undefined;
}

export const LodgeProfile: React.FC<LodgeProfileProps> = ({
  connectedAccount,
}) => {
  const labelStyling = "pl-1 mb-2 dark:text-gray-300 font-semibold";
  const inputStyling =
    "mt-2 p-4 w-full border-2 rounded-lg focus:border-primary focus:outline-none";

  const [selectedCover, setSelectedCover] = useState<File | undefined>(
    undefined
  );
  const [selectedProfile, setSelectedProfile] = useState<File | undefined>(
    undefined
  );

  const coverHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCover(e.target!.files![0]);
  };

  const profileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProfile(e.target!.files![0]);
  };

  return (
    <div>
      <section className="dark:bg-gray-900">
        <div className="mx-80 flex gap-4">
          <div className="w-full mx-auto shadow-2xl rounded-xl dark:bg-gray-800/40">
            <div className="">
              <div>
                <div
                  style={{
                    backgroundImage: `url(${
                      selectedCover
                        ? URL.createObjectURL(selectedCover!)
                        : "https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080"
                    })`,
                  }}
                  className="relative w-full rounded-tl-xl rounded-tr-xl bg-cover bg-center bg-no-repeat items-center flex justify-center p-8"
                >
                  <div
                    style={{
                      backgroundImage: `url(${
                        selectedProfile
                          ? URL.createObjectURL(selectedProfile!)
                          : "https://api.dicebear.com/9.x/adventurer/jpg?seed=robot"
                      })`,
                    }}
                    className="mx-auto my-auto flex justify-center items-center w-[141px] h-[141px] rounded-full bg-cover bg-center bg-no-repeat"
                  >
                    <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-24 mt-28">
                      <label htmlFor="upload_profile">
                        <svg
                          data-slot="icon"
                          className="w-6 h-5 text-blue-700 cursor-pointer"
                          fill="none"
                          stroke-width="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          ></path>
                        </svg>
                        <input
                          id="upload_profile"
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={profileHandler} // Fungsi untuk menangani file yang diupload
                          accept="image/jpeg, image/png"
                        />
                      </label>
                    </div>
                  </div>
                  {/* <div className="absolute bottom-0 right-0">
                    <div className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                      <label
                        htmlFor="upload_cover"
                        className="inline-flex items-center gap-1 cursor-pointer"
                      >
                        Cover
                        <svg
                          data-slot="icon"
                          className="w-6 h-5 text-blue-700"
                          fill="none"
                          stroke-width="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          ></path>
                        </svg>
                      </label>
                    </div>
                  </div> */}
                  <div className="absolute bottom-0 right-0">
                    <div className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                      <label
                        htmlFor="upload_cover"
                        className="inline-flex items-center gap-1 cursor-pointer"
                      >
                        Cover
                        <svg
                          data-slot="icon"
                          className="w-6 h-5 text-blue-700"
                          fill="none"
                          stroke-width="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          ></path>
                        </svg>
                      </label>

                      <input
                        id="upload_cover"
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={coverHandler}
                        accept="image/jpeg, image/png"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 justify-center w-full px-4 mt-8 mb-4">
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      ID
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="-"
                      disabled
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Host
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder={connectedAccount}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 justify-center w-full px-4 my-4">
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Accomodation Name
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="Lodge Name"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Accomodation Type
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 justify-center w-full px-4 my-4">
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Rating
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="0"
                      disabled
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Registered in Blockchain
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="Yes"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 justify-center w-full px-4">
                  <div className="w-full mb-4">
                    <label htmlFor="" className={labelStyling}>
                      Address
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="w-full rounded-lg bg-primary mt-4 text-secondary text-lg font-semibold">
                    <button type="submit" className="w-full p-4">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
