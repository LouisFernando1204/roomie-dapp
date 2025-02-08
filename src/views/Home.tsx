import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import image1 from "/images/pic_1_upscale.jpeg";
import image2 from "/images/pic_2_upscale.jpeg";
import image3 from "/images/pic_3_upscale.jpeg";
import { roomieAdvantage } from "../utils/list";
import { getRooms } from "../server/room";
import { Room } from "../model/room";
import { LoadingScreen } from "../components/ui/loading-screen";
import { getAccommodations } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";

import { Coins, Hotel, MapPinHouse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const images = [image1, image2, image3];

const Home = () => {
  const [index, setIndex] = useState(0);

  const [homeLoading, setHomeLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    setHomeLoading(true);
    try {
      const rooms = await getRooms();
      const accommodations = await getAccommodations();

      if (rooms && accommodations) {
        const updatedRooms = await Promise.all(
          rooms.map(async (room: Room, _: any) => {
            const filteredAccommodation: Accommodation = accommodations.find(
              (accommodation: Accommodation) =>
                accommodation.id === room.accommodationId
            );

            if (!filteredAccommodation) {
              console.warn(`Accommodation not found for room ID: ${room.id}`);
              return {
                ...room,
                accommodationName: "Unknown",
                address: "Unknown",
              };
            }

            return {
              ...room,
              accommodationName: filteredAccommodation.accommodationName,
              address: filteredAccommodation.address,
            };
          })
        );
        setRooms(updatedRooms);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setHomeLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (homeLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="font-lato h-screen w-full -mt-12 md:-mt-32">
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full flex-shrink-0 shadow-lg h-screen object-cover"
              />
            ))}
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-0"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-2xl md:text-3xl lg:text-5xl font-black text-center"
            >
              When Hospitality Come Together with AI and Web3
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-sm md:text-md lg:text-lg px-12 lg:px-56 text-center"
            >
              Roomie is a Web3 AI-powered accommodation booking platform built
              on the Manta Pacific ecosystem. Utilizing the ERC-1155 standard
              and an escrow-based deposit system, Roomie ensures a secure,
              transparent, and decentralized booking experience. By prioritizing
              safety and trust, it reduces the risk of fraud and fosters a
              reliable platform for all participants.{" "}
            </motion.h2>
          </motion.div>
        </div>
      </div>

      <section className="py-16 px-6 md:px-12 lg:px-20 bg-lightGray">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-3xl font-bold text-darkOrange text-center mb-8"
        >
          Why Roomie is Your Perfect Travel Buddy?
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {roomieAdvantage.map((roomie, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer rounded-lg"
            >
              <div
                key={index}
                className={`text-center p-6 bg-darkOrange text-secondary backdrop-blur-lg rounded-lg shadow-lg transition-all hover:scale-105 duration-500 ease-in-out hover:shadow-2xl`}
              >
                <div className="flex items-center justify-center mb-4">
                  <roomie.icon size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{roomie.header}</h3>
                <p className="">{roomie.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-16 px-6 md:px-12 lg:px-20 bg-lightGray">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-3xl font-bold text-darkOrange text-center mb-8"
        >
          Here are the rooms we have to offer—choose the one that suits you
          best.
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {rooms.map((listing) => (
            <motion.div
              key={listing.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              onClick={() => {
                navigate(`/roomdetail/${listing.id}`);
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden ease-in-out hover:scale-105 duration-200 transition-transform cursor-pointer"
            >
              <img
                src={listing.imageUrls[0]}
                alt={listing.roomType}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{listing.roomType}</h3>
                  <div className="flex flex-row items-center space-x-1">
                    <Coins size={18} color="orange" />
                    <h3 className="text-md">{listing.price} ETH</h3>
                  </div>
                </div>
                <div className="flex flex-row items-center space-x-1">
                  <Hotel size={18} color="orange" />
                  <h3 className="text-sm text-gray-500">
                    {listing.accommodationName}
                  </h3>
                </div>
                <div className="flex flex-row items-center space-x-1">
                  <MapPinHouse size={18} color="orange" />
                  <h3 className="text-sm text-gray-500">{listing.address}</h3>
                </div>
                <p className="text-sm mt-2 line-clamp-3">
                  {listing.roomDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Home;
