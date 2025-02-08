import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import image1 from "/images/pic_1_upscale.jpeg";
import image2 from "/images/pic_2_upscale.jpeg";
import image3 from "/images/pic_3_upscale.jpeg";

const images = [image1, image2, image3];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

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

  // Get today's date and tomorrow's date
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("en-CA");

  return (
    <>
      <div className="font-lato h-screen w-full">
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
            className="absolute z-10 top-1/3 left-48 transform text-start text-white space-y-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-5xl font-black leading-tight"
            >
              The Web3 Way
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl font-black leading-tight"
            >
              to Book Your Next Stay
            </motion.h2>
          </motion.div>

          {/* Search Bar */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-secondary p-4 rounded-lg shadow-lg z-10 flex items-center max-w-4xl w-full mt-4 space-x-4 hidden md:flex">
            <div className="flex-grow flex flex-col items-start border-r px-4">
              <label className="text-sm font-semibold mb-2 text-darkOrange">
                Where
              </label>
              <input
                type="text"
                placeholder="Find destination"
                className="p-3 border rounded-lg focus:border-transparent focus:ring-2 focus:ring-darkOrange bg-transparent w-full appearance-none"
              />
            </div>
            <div className="flex-grow flex flex-col items-start border-r px-4">
              <label className="text-sm font-semibold mb-2 text-darkOrange">
                Check in
              </label>
              <input
                type="date"
                value={today} // Set today's date by default
                className="p-3 border rounded-lg focus:border-transparent focus:ring-2 focus:ring-darkOrange bg-transparent w-full appearance-none"
              />
            </div>
            <div className="flex-grow flex flex-col items-start border-r px-4">
              <label className="text-sm font-semibold mb-2 text-darkOrange">
                Check out
              </label>
              <input
                type="date"
                value={tomorrow} // Set tomorrow's date by default
                className="p-3 border rounded-lg focus:border-transparent focus:ring-2 focus:ring-darkOrange bg-transparent w-full appearance-none"
              />
            </div>
            <div className="flex-grow flex flex-col items-start px-4">
              <label className="text-sm font-semibold mb-2 text-darkOrange">
                Person
              </label>
              <input
                type="number"
                placeholder="Add guests"
                className="p-3 border rounded-lg focus:border-transparent focus:ring-2 focus:ring-darkOrange bg-transparent w-full"
              />
            </div>
            <button className="bg-darkOrange text-white rounded-full p-3 shadow-lg hover:bg-darkOrange/80 transition duration-200 ease-in-out">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <section className="bg-lightGray pt-32 pb-16 px-6 md:px-12 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="transform text-start text-white space-y-4"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-3xl font-bold text-darkOrange mb-4"
            >
              About Roomie
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg text-almostBlack opacity-80 leading-relaxed"
            >
              Roomie is a Web3 AI-powered accommodation booking platform built
              on the Manta Pacific ecosystem. Utilizing the ERC-1155 standard
              and an escrow-based deposit system, Roomie ensures a secure,
              transparent, and decentralized booking experience. By prioritizing
              safety and trust, it reduces the risk of fraud and fosters a
              reliable platform for all participants.
            </motion.p>
          </motion.div>
        </div>
      </section>
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-lightGray">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-3xl font-bold text-darkOrange text-center mb-8"
        >
          Near You!
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

        {/* Recommendation Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-darkOrange text-white px-6 py-3 rounded-lg shadow-lg hover:bg-darkOrange/80 transition duration-200 ease-in-out"
          >
            Get Recommendations
          </button>
        </div>
      </section>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-darkOrange mb-4">
              Recommended Stays
            </h2>
            <p className="text-gray-700 mb-4">
              Here are some hand-picked stays just for you!
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {listings.slice(0, 2).map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-100 rounded-lg shadow p-4"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600">
                    {listing.roomType} - {listing.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    {listing.hotelName}, {listing.location}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              <FaTimes className="inline-block mr-1" /> Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
