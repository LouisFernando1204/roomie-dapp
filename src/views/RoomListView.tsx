"use client";
import React, { useEffect, useState } from "react";
import { Accommodation } from "../model/accommodation";
import { EmptyPage } from "./EmptyPage";
import { CreateRoomModal } from "../components/modal/CreateRoomModal";
import { getRooms } from "../server/room";
import { LoadingScreen } from "../components/ui/loading-screen";
import { Room } from "../model/room";
import { normalModal, successModal } from "../utils/helper";
import { mint } from "../services/host";
import { tokenDetail, uri } from "../services/public";

interface RoomListProps {
  walletProvider: any;
  accommodation: Accommodation | undefined;
  isConnected: boolean;
}

const RoomList: React.FC<RoomListProps> = ({
  walletProvider,
  accommodation,
  isConnected,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [mintValue, setMintValue] = useState("");

  const openModal = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const openMintModal = (room: Room) => {
    setSelectedRoom(room);
    setShowMintModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const closeMintModal = () => {
    setShowMintModal(false);
    setSelectedRoom(null);
  };

  const errorScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while mint a token. Please try again later!"
        );
      }, 1000);
    }
  };

  const mintToken = async (tokenId: number) => {
    closeMintModal();
    setLoading(true);
    try {
      const tx = await mint(
        accommodation!.id,
        tokenId,
        parseInt(mintValue),
        "",
        walletProvider
      );
      const receipt = await tx.wait();
      if (receipt) {
        setUpdate(!update);
        if (!loading) {
          setTimeout(() => {
            successModal("Minted Successfully!", tx.hash);
          }, 2000);
        }
      } else {
        errorScenario();
      }
    } catch (error) {
      console.log(error);
      errorScenario();
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms();
      const filtered = res.filter(
        (room: Room) =>
          String(room.accommodationId).trim() ===
          String(accommodation!.id).trim()
      );
      if (filtered) {
        const updatedRooms = await Promise.all(
          filtered.map(async (room: Room, _: any) => {
            const data = await tokenDetail(room.tokenId);
            const metadata = await uri(room.tokenId);
            return {
              ...room,
              supply: data.tokenSupply,
              burn: data.tokenBurn,
              tokenMetadata: metadata,
            };
          })
        );
        setRooms(updatedRooms);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [accommodation, update]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isConnected || !accommodation) {
    return (
      <EmptyPage
        title={"Oops.."}
        text={
          "Unfortunately you don't have an access to access this page. Please register your accommodation (Lodge) first!"
        }
      />
    );
  }

  return (
    <div className="">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-darkOrange">
          {`${accommodation.accommodationName} room list`}
        </h1>
      </div>
      <button
        onClick={() => setShowCreateModal(true)}
        className="p-3 mb-8 text-secondary bg-darkOrange rounded-xl duration-200 hover:scale-105 shadow-md"
      >
        Create Room
      </button>

      {rooms.length > 0 ? (
        <div className="mb-8 relative overflow-x-auto shadow-md sm:rounded-lg bg-brightYellow">
          <table className="w-full text-sm text-left rtl:text-right text-darkOrange">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Room type
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Token ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Supply
                </th>
                <th scope="col" className="px-6 py-3">
                  Burn
                </th>
                <th scope="col" className="px-6 py-3">
                  Bed Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Max People
                </th>
                <th scope="col" className="px-6 py-3">
                  Price (ETH)
                </th>
                <th scope="col" className="px-6 py-3">
                  Facilities
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
                <th scope="col" className="px-6 py-3">
                  Mint
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {room.roomType}
                  </td>
                  <td className="px-6 py-4">{room.roomDescription}</td>
                  <td className="px-6 py-4">{room.tokenId}</td>

                  <td className="px-6 py-4">{room.supply}</td>
                  <td className="px-6 py-4">{room.burn}</td>

                  <td className="px-6 py-4">{room.bedSize}</td>
                  <td className="px-6 py-4">{room.maxOccupancy}</td>
                  <td className="px-6 py-4">{room.price}</td>
                  <td className="px-6 py-4">{room.facilities.join(", ")}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openModal(room)}
                      className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-600 rounded-lg text-sm"
                    >
                      Images
                    </button>
                    <button className="px-4 py-2 bg-brightYellow text-white hover:bg-darkYellow rounded-lg text-sm">
                      <a href={room.tokenMetadata} target="_blank" rel="noopener noreferrer">View Metadata</a>
                    </button>
                  </td>
                  <td
                    onClick={() => openMintModal(room)}
                    className="px-6 py-4 cursor-pointer text-complementary hover:underline"
                  >
                    Mint
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyPage
          title="Uh-oh! No rooms yet!"
          text="Looks like you haven't added any rooms. Why not create one and get started?"
        />
      )}

      {showCreateModal && (
        <CreateRoomModal
          accommodation={accommodation}
          setShowModal={setShowCreateModal}
          loading={loading}
          setLoading={setLoading}
          update={update}
          setUpdate={setUpdate}
          walletProvider={walletProvider}
        />
      )}

      {showModal && selectedRoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{selectedRoom.roomType}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              {selectedRoom.imageUrls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Room ${selectedRoom.roomType} view ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {showMintModal && selectedRoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closeMintModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">
                Mint Token for ID: {selectedRoom.tokenId}
              </h3>
              <button
                onClick={closeMintModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mx-4 my-4">
              <label
                htmlFor=""
                className={`pl-1 mb-2 dark:text-gray-300 font-semibold`}
              >
                How many tokens would you like to mint?
              </label>
              <input
                type="number"
                className={`mt-2 p-4 w-full border-2 rounded-lg focus:border-primary focus:outline-none`}
                placeholder="E.g., 1, 2"
                onChange={(e) => setMintValue(e.target.value)}
                min={0}
                step={1}
              />
              <button
                onClick={() => mintToken(selectedRoom.tokenId)}
                className="p-3 bg-brightYellow w-full text-secondary rounded-xl mt-6 font-semibold shadow-md"
              >
                Mint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
