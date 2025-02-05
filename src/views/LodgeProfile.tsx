/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Accommodation } from "../model/accommodation";
import { normalModal, successModal } from "../utils/helper";
import {
  createAccommodation,
  updateAccommodation,
} from "../server/accommodation";
import { registerLodge } from "../services/host";
import { pinata } from "../global/global";

interface LodgeProfileProps {
  connectedAccount: string | undefined;
  walletProvider: any;
  accommodation: Accommodation | undefined;
  lodgeUpdate: boolean;
  setLodgeUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LodgeProfile: React.FC<LodgeProfileProps> = ({
  connectedAccount,
  walletProvider,
  accommodation,
  setLodgeUpdate,
  lodgeUpdate,
  loading,
  setLoading,
}) => {
  const labelStyling = "pl-1 mb-2 dark:text-gray-300 font-semibold";
  const inputStyling =
    "mt-2 p-4 w-full border-2 rounded-lg focus:border-primary focus:outline-none";

  const [id, setId] = useState<string>("-");
  const [rating, setRating] = useState<number>(0);
  const [accommodationName, setAccommodationName] = useState<string>("");
  const [accommodationType, setAccommodationType] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [logoImageUrl, setLogoImageUrl] = useState<string>(
    "https://api.dicebear.com/9.x/adventurer/jpg?seed=robot"
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080"
  );

  const coverHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverImageUrl(URL.createObjectURL(e.target!.files![0]));
  };

  const profileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoImageUrl(URL.createObjectURL(e.target!.files![0]));
  };

  useEffect(() => {
    console.log(loading)
    if (accommodation) {
      setId(accommodation.id);
      setAccommodationName(accommodation.accommodationName);
      setAccommodationType(accommodation.accommodationType);
      setAddress(accommodation.address);
      setLogoImageUrl(accommodation.logoImageUrl);
      setCoverImageUrl(accommodation.coverImageUrl);
      setRating(accommodation.rating)

    } else {
      normalModal(
        "info",
        "No Accommodation Registered Yet",
        "No accommodations registered. Please complete your Lodge Profile by adding your accommodation details."
      );
    }
  }, [accommodation]);

  const registerNewLodge = async () => {
    setLoading(true);
    try {
      const { coverImageUrl, logoImageUrl } = await uploadImageToPinata();

      const res = await createAccommodation(
        connectedAccount!,
        accommodationName,
        accommodationType,
        address,
        logoImageUrl,
        coverImageUrl
      );
      if (res!.status == 201) {
        const tx = await registerLodge(
          res!.data.accommodation._id,
          walletProvider
        );
        await tx.wait();
        setLodgeUpdate(!lodgeUpdate);
        setTimeout(() => {
          successModal("Registered Successfully!", tx.hash);
        }, 2500);
      } else {
        errorScenario();
      }
    } catch (error) {
      console.log(error);
      errorScenario();
    }
  };

  const errorScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while register your accommodation. Please try again later!"
        );
      }, 1000);
    }
  };

  const updateLodge = async () => {
    setLoading(true);
    try {
      const { coverImageUrl, logoImageUrl } = await uploadImageToPinata();

      const res = await updateAccommodation(
        id,
        accommodationName,
        accommodationType,
        address,
        logoImageUrl,
        coverImageUrl
      );
      if (res!.status == 200) {
        setLodgeUpdate(!lodgeUpdate);
        if (!loading) {
          normalModal(
            "success",
            "Updated Successfully!",
            "Your accommodation has been successfully updated!"
          );
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (!loading) {
        normalModal(
          "error",
          "Oops...",
          "Error while update your accommodation. Please try again later!"
        );
      }
    }
  };

  const uploadImageToPinata = async () => {
    try {
      const coverUpload = await pinata.upload.url(coverImageUrl);
      const hashedCoverUrl = `https://gateway.pinata.cloud/ipfs/${coverUpload.IpfsHash}`;
      setCoverImageUrl(hashedCoverUrl);

      const logoUpload = await pinata.upload.url(logoImageUrl);
      const hashedLogoUrl = `https://gateway.pinata.cloud/ipfs/${logoUpload.IpfsHash}`;
      setLogoImageUrl(hashedLogoUrl);
      return { coverImageUrl: hashedCoverUrl, logoImageUrl: hashedLogoUrl };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div>
      <section className="dark:bg-gray-900 mb-12">
        <div className="xl:mx-80 flex gap-4">
          <div className="w-full shadow-2xl rounded-xl dark:bg-gray-800/40">
            <div className="">
              <div>
                <div
                  style={{
                    backgroundImage: `url(${coverImageUrl})`,
                  }}
                  className="relative w-full rounded-tl-xl rounded-tr-xl bg-cover bg-center bg-no-repeat items-center flex justify-center p-8"
                >
                  <div
                    style={{
                      backgroundImage: `url(${logoImageUrl})`,
                    }}
                    className="mx-auto my-auto flex justify-center items-center w-[141px] h-[141px] rounded-full bg-cover bg-center bg-no-repeat"
                  >
                    <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-24 mt-28">
                      <label htmlFor="upload_profile">
                        <svg
                          data-slot="icon"
                          className="w-6 h-5 text-blue-700 cursor-pointer"
                          fill="none"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                          strokeWidth="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                      placeholder={id}
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
                      placeholder="Input your accommodation name..."
                      value={accommodationName}
                      onChange={(e) => setAccommodationName(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="" className={labelStyling}>
                      Accomodation Type
                    </label>
                    <input
                      type="text"
                      className={inputStyling}
                      placeholder="Input your accommodation type..."
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
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
                      placeholder={`${rating}`}
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
                      placeholder={id != "-" ? "Yes" : "No"}
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
                      placeholder="Input your accommodation address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="w-full rounded-lg bg-primary mt-4 text-secondary text-lg font-semibold">
                    <button
                      onClick={() => {
                        id != "-" ? updateLodge() : registerNewLodge();
                      }}
                      type="submit"
                      className="w-full p-4"
                    >
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
