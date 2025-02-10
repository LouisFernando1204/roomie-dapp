/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { normalModal, successModal } from "../../utils/helper";
import { parseEther } from "ethers";
import { createRoom, deleteRoom } from "../../server/room";
import { pinata } from "../../global/global";
import { Accommodation } from "../../model/accommodation";
import { registerToken } from "../../services/host";

interface CreateRoomModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  accommodation: Accommodation | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  update: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  walletProvider: any;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  setShowModal,
  accommodation,
  loading,
  setLoading,
  update,
  setUpdate,
  walletProvider,
}) => {
  const [lodgeId, setLodgeId] = useState("");

  const [tokenId, setTokenId] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");

  const [roomType, setRoomType] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [bedType, setBedType] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [facilities, setFacilities] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [nft, setNft] = useState<string>("");

  const handleNftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      setNft(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...fileArray]);
    }
  };

  const submit = async () => {
    setLoading(true);
    const success = checkInput();
    if (success) {
      try {
        const { uploadedImages } = await uploadImageToPinata();
        const nftHash = await uploadedNftHash();
        const tokenUri = await createTokenUri(nftHash!);
        if (tokenUri) {
          console.log(tokenUri);
          const res = await createRoom(
            parseInt(tokenId),
            lodgeId,
            roomType,
            roomDescription,
            facilities.split(",").map((item: string) => item.trim()),
            parseFloat(tokenPrice),
            bedType,
            parseInt(maxPeople),
            uploadedImages
          );
          if (res!.status == 201) {
            try {
              const tx = await registerToken(
                accommodation!.id,
                tokenUri,
                parseInt(tokenId),
                tokenPrice,
                walletProvider
              );
              if (tx) {
                setShowModal(false);
                setUpdate(!update);
                setTimeout(() => {
                  successModal("Created Successfully!", tx.hash);
                }, 2500);
              } else {
                setShowModal(false);
                await deleteRoom(res!.data.room._id);
                errorScenario();
              }
            } catch (error) {
              console.log(error);
              setShowModal(false);
              await deleteRoom(res!.data.room._id);
              errorScenario();
            }
          }
        } else {
          errorScenario();
        }
      } catch (error) {
        console.log(error);
        errorScenario();
      }
    }
  };

  const uploadedNftHash = async () => {
    try {
      const upload = await pinata.upload.url(nft);
      return `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageToPinata = async () => {
    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const upload = await pinata.upload.url(image);
          return `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;
        })
      );
      return { uploadedImages };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const errorScenario = () => {
    setShowModal(false);
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while create your room type. Please try again later!"
        );
      }, 1000);
    }
  };

  const checkInput = () => {
    if (
      lodgeId == "" ||
      parseInt(tokenId) <= 0 ||
      parseEther(tokenPrice) <= 0 ||
      roomType == "" ||
      bedType == "" ||
      parseInt(maxPeople) <= 0 ||
      facilities.split(",").map((item: string) => item.trim()).length == 0 ||
      images.length == 0
    ) {
      normalModal(
        "error",
        "Oops..",
        "Something’s missing or incorrect. Let’s make it perfect—double-check your input!"
      );
      return false;
    }
    return true;
  };

  const createTokenUri = async (imageUrl: string) => {
    const jsonToUpload = {
      name: roomType,
      description: roomDescription,
      image: imageUrl,
    };
    return (await pinata.upload.json(jsonToUpload)).IpfsHash;
  };

  useEffect(() => {
    setLodgeId(accommodation!.id);
  }, [accommodation]);

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
        data-aos-duration="300"
        className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/5 max-h-[90%] py-6 md:py-8 px-4 md:px-6 overflow-y-auto no-scrollbar relative"
      >
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h1 className="text-gray-600 font-bold md:text-xl">
            Create a new room
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
              Room Type
            </label>
            <input
              type="text"
              className={inputStyling}
              placeholder="E.g., Deluxe Room, Single Room"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Token ID
            </label>
            <input
              type="number"
              className={inputStyling}
              value={tokenId}
              placeholder="Enter the unique token ID"
              onChange={(e) => setTokenId(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Price per night (ETH)
            </label>
            <input
              type="number"
              value={tokenPrice}
              className={inputStyling}
              placeholder="E.g., 0.01, 0.05"
              onChange={(e) => setTokenPrice(e.target.value)}
              min={0}
            />
            <label htmlFor="" className={labelStyling}>
              Description
            </label>
            <textarea
              className={inputStyling}
              value={roomDescription}
              placeholder="E.g., Modern deluxe room with a king-sized bed, WiFi, and air conditioning."
              onChange={(e) => setRoomDescription(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Bed Type
            </label>
            <input
              type="text"
              className={inputStyling}
              value={bedType}
              placeholder="E.g., King Size, Twin Beds"
              onChange={(e) => setBedType(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Max People
            </label>
            <input
              type="number"
              min={1}
              className={inputStyling}
              value={maxPeople}
              placeholder="E.g., 2, 4, 6"
              onChange={(e) => setMaxPeople(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Facilities (Separate with comma)
            </label>
            <input
              type="text"
              className={inputStyling}
              value={facilities}
              placeholder="E.g., WiFi, TV, Air Conditioner"
              onChange={(e) => setFacilities(e.target.value)}
            />
            <label htmlFor="" className={labelStyling}>
              Room Images (3 required)
            </label>
            <div className="mt-2 flex flex-col items-center gap-2">
              <input
                type="file"
                id="imageUpload"
                multiple
                className={`${inputStyling}`}
                onChange={handleImageChange}
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
                {images.length > 0 &&
                  images.map((image, index) => (
                    <div
                      key={index}
                      className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <label htmlFor="" className={labelStyling}>
              NFT Images
            </label>
            <div className="mt-2 flex flex-col items-center gap-2">
              <input
                type="file"
                id="imageUpload"
                multiple
                className={`${inputStyling}`}
                onChange={handleNftChange}
              />
              <div className="flex justify-center items-center mt-2">
                {nft && (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={nft} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={submit}
            className="bg-primary text-secondary hover:scale-105 duration-200 rounded-xl p-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
