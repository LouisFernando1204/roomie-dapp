import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "../model/room";
import { getRoomsById } from "../server/room";
import { LoadingScreen } from "../components/ui/loading-screen";
import {
  Bed,
  DoorOpen,
  Hotel,
  MapPinHouse,
  Star,
  UserRound,
  Wallet,
  LayoutGrid
} from "lucide-react";
import { getAccommodations } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";
import { normalModal, successModal } from "../utils/helper";
import { createBooking, deleteBooking } from "../server/booking";
import { reserve } from "../services/customer";
import { tokenDetail } from "../services/public";
import { getAccommodationRating } from "../server/rating";

interface RoomDetailProps {
  walletProvider: any;
  address: string;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ walletProvider, address }) => {
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>("");
  const [selectedCheckOut, setSelectedCheckOut] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room>();
  const [accommodation, setAccommodation] = useState<Accommodation>();
  const [totalRating, setTotalRating] = useState(0);
  const [nftSlot, setNftSlot] = useState(0);

  const { id } = useParams();

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCheckIn(e.target.value);
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCheckOut(e.target.value);
  };

  const errorScenarioCreateBooking = () => {
    setLoading(false);
    setTimeout(() => {
      normalModal(
        "error",
        "Oops...",
        `Error while try to process your order. Please try again later!`
      );
    }, 1500);
  };

  const onCreate = async () => {
    setLoading(true);

    const checkInTimestamp = Math.floor(
      new Date(selectedCheckIn).getTime() / 1000
    );
    const checkOutTimestamp = Math.floor(
      new Date(selectedCheckOut).getTime() / 1000
    );
    const durationInDays = Math.ceil(
      (checkOutTimestamp - checkInTimestamp) / 86400
    );
    console.log(durationInDays);
    console.log(checkInTimestamp);
    console.log(checkOutTimestamp);
    console.log(address);
    console.log(room!.id);
    console.log(room!.tokenId);

    console.log(accommodation!.id);

    if (checkInTimestamp > checkOutTimestamp) {
      errorScenarioCreateBooking();
    } else {
      try {
        const res = await createBooking(
          accommodation!.id,
          room!.id,
          room!.tokenId,
          address!,
          checkInTimestamp,
          checkOutTimestamp,
          durationInDays
        );
        if (res!.status == 201) {
          try {
            const tx = await reserve(
              accommodation!.id,
              res!.data.booking._id,
              room!.tokenId,
              durationInDays,
              checkInTimestamp,
              walletProvider
            );
            if (tx) {
              setLoading(false);
              setTimeout(() => {
                successModal("Book Placed Successfully!", tx.hash);
              }, 2000);
            } else {
              await deleteBooking(res!.data.booking._id);
              errorScenarioCreateBooking();
            }
          } catch (error) {
            console.log(res!.data.booking._id);
            await deleteBooking(res!.data.booking._id);
            errorScenarioCreateBooking();
          }
        } else {
          errorScenarioCreateBooking();
        }
      } catch (error) {
        console.log(error);
        errorScenarioCreateBooking();
      }
    }
  };

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const room = await getRoomsById(id!);
      const accommodations = await getAccommodations();

      if (room && accommodations) {
        const filtered = accommodations.find(
          (accommodation: Accommodation) =>
            accommodation.id === room.accommodationId
        );
        console.log(room);
        if (filtered) {
          setAccommodation(filtered);
        }
        setRoom(room);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTokenDetail = async() => {
    try {
      const nftSlot = await tokenDetail(room!.tokenId);

      if (nftSlot) {
        setNftSlot(nftSlot.tokenSupply);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRating = async() => {
    try {
      const totalRating = await getAccommodationRating(accommodation!.id);
      if(totalRating){
        setTotalRating(totalRating);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  useEffect(() => {
    if (room && room.tokenId) {
      getTokenDetail();
      getRating();
    }
  }, [room]);

  if (loading || !room || !accommodation) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full space-y-6 px-12 mb-12">
      {/* Image Gallery */}
      <div className="flex bg-secondary p-4 border border-darkOrange rounded-xl">
        <div className="w-2/3">
          <img
            src={room!.imageUrls[0]}
            alt="Main Room"
            className="w-full h-auto rounded-xl"
          />
        </div>
        <div className="w-1/3 flex flex-col space-y-2 ps-2">
          <img
            src={room!.imageUrls[1]}
            alt="Room View 1"
            className="w-full h-auto rounded-xl"
          />
          <img
            src={room!.imageUrls[2]}
            alt="Room View 2"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>

      <div className="bg-secondary border border-darkOrange p-4 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">About This Room</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="flex items-center space-x-2">
            <DoorOpen size={32} color="orange" />
            <span className="text-gray-700 text-lg">{room.roomType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bed size={32} color="orange" />
            <span className="text-gray-700 text-lg">{room.bedSize}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserRound size={32} color="orange" />
            <span className="text-gray-700 text-lg">
              {room.maxOccupancy} people
            </span>
          </div>
          <div className="flex items-center space-x-2">
          <Star size={32} color="orange" />
          <span className="text-gray-700 text-lg">{totalRating}</span>
          </div>
          <div className="flex items-center space-x-2">
            <LayoutGrid size={32} color="orange" />
            <span className="text-gray-700">{room.facilities.join(",")}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary border border-darkOrange p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Description</h1>
        <p className="text-lg font-light">{room.roomDescription}</p>
      </div>

      <div className="bg-secondary border border-darkOrange p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">About the Accommodation</h1>
        <div className="flex flex-row space-x-10 items-center">
          <img
            src={accommodation!.logoImageUrl}
            alt=""
            className="rounded-full size-20 border border-black"
          />
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row space-x-2 items-center">
              <Hotel size={24} color="orange" />
              <h2 className="text-lg">{accommodation.accommodationName}</h2>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <MapPinHouse size={24} color="orange" />
              <h2 className="text-lg">{accommodation.address}</h2>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <Wallet size={24} color="orange" />
              <h2 className="text-lg">{accommodation.accommodationHost}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-14 left-1/2 transform border border-darkOrange -translate-x-1/2 bg-secondary p-5 rounded-lg shadow-lg z-10 max-w-6xl w-full hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-darkOrange mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={selectedCheckIn}
              onChange={handleCheckInChange}
              className="p-3 border rounded-lg bg-transparent w-full focus:ring-2 focus:ring-darkOrange focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-darkOrange mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={selectedCheckOut}
              onChange={handleCheckOutChange}
              className="p-3 border rounded-lg bg-transparent w-full focus:ring-2 focus:ring-darkOrange focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-darkOrange mb-1">
              NFT Slot: {nftSlot}
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold">{room.price}ETH/night</h1>
          <button
            onClick={onCreate}
            className="bg-darkOrange px-6 py-3 rounded-md hover:scale-105 duration-200 flex items-center gap-2 shadow-md text-white font-semibold"
          >
            Book Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
