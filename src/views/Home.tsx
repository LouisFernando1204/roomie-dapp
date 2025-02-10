/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { askToGPT } from "../server/ai";

const images = [image1, image2, image3];

const Home = () => {
  const [index, setIndex] = useState(0);

  const [homeLoading, setHomeLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; message: string }[]>([]);
  const [randomGreeting, setRandomGreeting] = useState("");

  const greetings = [
    "Welcome to Roomie! Ready to find your perfect stay?",
    "Hey there! Need help booking your next accommodation?",
    "Hello! Roomie is here to make your travel hassle-free.",
    "Looking for a stay? Roomie has you covered!",
    "Trust, safety, and comfort—let Roomie assist you!"
  ];

  useEffect(() => {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setRandomGreeting(greeting);
  }, []);

  const navigate = useNavigate()

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

  const chatWithRoomieAI = async (message: string) => {
    if (!message.trim()) return;
    setChatHistory((prev) => [...prev, { sender: "user", message }]);
    setChatQuestion("");
    setChatHistory((prev) => [...prev, { sender: "ai", message: "RooM8 is thinking..." }]);
    setChatLoading(true);
    try {
      const roomieAIResponse = await askToGPT(message);
      if (roomieAIResponse) {
        console.log(roomieAIResponse);
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", message: roomieAIResponse },
        ]);
      }
    } catch (error) {
      console.log(error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", message: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
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
          {rooms.length > 0 && `Here are the rooms we have to offer—choose the one that suits you
          best.`}
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
      {/* Chatbot Floating Button and Popup */}
      {isChatOpen && (
        <div
          data-aos="zoom-in-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-duration="300"
          className="fixed bottom-20 right-4 w-96 h-3/5 bg-white rounded-lg shadow-lg overflow-hidden z-50 pb-2">
          {/* Header */}
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h4 className="text-lg font-semibold">RoomieTalk</h4>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-600 text-2xl leading-none">
              &times;
            </button>
          </div>
          <div className="p-4 h-3/4 overflow-y-auto bg-gray-50 space-y-4">
            {/* RooM8 Greeting Message */}
            <div className="flex items-start gap-2.5">
              <img
                className="w-8 h-8 rounded-full"
                src="https://img.icons8.com/?size=100&id=m31DrURYH9au&format=png&color=FD7E14"
                alt="Chatbot Avatar"
              />
              <div className="flex flex-col w-full max-w-[320px] p-4 border border-yellow-200 bg-yellow-100 rounded-e-xl rounded-es-xl">
                <span className="text-sm font-semibold text-gray-900">RooM8</span>
                <p className="text-sm text-gray-900 py-2.5">{randomGreeting}</p>
              </div>
            </div>
            {/* Render Chat History */}
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex items-start gap-2.5 ${chat.sender === "user" ? "justify-end" : ""}`}>
                {/* AI (RooM8) Avatar */}
                {chat.sender === "ai" && (
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://img.icons8.com/?size=100&id=m31DrURYH9au&format=png&color=FD7E14"
                    alt="Chatbot Avatar"
                  />
                )}
                {/* Chat Bubble */}
                <div
                  className={`flex flex-col w-full max-w-[320px] p-4 border ${chat.sender === "user"
                    ? "border-gray-200 bg-white rounded-xl rounded-tr-none text-end"
                    : "border-yellow-200 bg-yellow-100 rounded-e-xl rounded-es-xl"
                    }`}
                >
                  {/* Sender Name */}
                  <div className={`flex items-center ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <span className="text-sm font-semibold text-gray-900">
                      {chat.sender === "user" ? "You" : "RooM8"}
                    </span>
                  </div>
                  {/* Message */}
                  <p className="text-sm text-gray-900 py-2.5">
                    {chat.message === "RooM8 is thinking..." ? (
                      <span className="flex items-center">
                        RooM8 is thinking
                        <span className="flex flex-row space-x-1 ml-2">
                          <span className="w-2 h-2 bg-gray-900 rounded-full animate-blink"></span>
                          <span className="w-2 h-2 bg-gray-900 rounded-full animate-blink [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-gray-900 rounded-full animate-blink [animation-delay:0.4s]"></span>
                        </span>
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: chat.message }}></span>
                    )}
                  </p>
                </div>
                {/* User Avatar */}
                {chat.sender === "user" && <img className="w-8 h-8 rounded-full" src="/images/user.png" alt="User Avatar" />}
              </div>
            ))}
          </div>
          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded focus:outline-none"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && chatWithRoomieAI(chatQuestion)}
              />
              <button onClick={() => chatWithRoomieAI(chatQuestion)} className={`p-2 bg-complementary text-white rounded ${chatLoading ? "bg-gray-300 cursor-not-allowed" : "hover:bg-skyBlue"
                }`}
                disabled={chatLoading} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.01 21l20.99-9L2.01 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-complementary hover:bg-skyBlue text-white p-4 rounded-full shadow-lg z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9a9 9 0 01-4.5-1.2l-3.7 1 1-3.7A9 9 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
        </svg>
      </button>
    </>
  );
};

export default Home;
