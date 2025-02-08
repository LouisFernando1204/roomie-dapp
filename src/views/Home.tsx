import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import image1 from "/images/pic_1_upscale.jpeg";
import image2 from "/images/pic_2_upscale.jpeg";
import image3 from "/images/pic_3_upscale.jpeg";
import { roomieAdvantage } from "../utils/list";

const images = [image1, image2, image3];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const listings = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Kamar Nyaman ${i + 1}`,
    image: `https://source.unsplash.com/400x300/?hotel,room,apartment&random=${i}`,
    roomType: i % 2 === 0 ? "Deluxe Room" : "Standard Room",
    price: `$${50 + i * 20}/night`,
    hotelName: `Hotel Contoh ${i + 1}`,
    location: "Jakarta, Indonesia",
    description:
      "Kamar luas dengan fasilitas lengkap, cocok untuk liburan atau perjalanan bisnis.",
  }));

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

          {/* Dark overlay for the background image */}
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-0"></div>

          {/* Tagline */}
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
              className="text-2xl md:text-3xl lg:text-5xl font-black"
            >
              Web3 Meets Hospitality: Your Stay, Your Way
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
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {roomieAdvantage.map((roomie, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              
            </motion.div>
          ))}
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{listing.title}</h3>
                <p className="text-gray-600">
                  {listing.roomType} - {listing.price}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.hotelName}, {listing.location}
                </p>
                <p className="text-sm mt-2">{listing.description}</p>
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
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{listing.title}</h3>
                <p className="text-gray-600">
                  {listing.roomType} - {listing.price}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.hotelName}, {listing.location}
                </p>
                <p className="text-sm mt-2">{listing.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Home;
