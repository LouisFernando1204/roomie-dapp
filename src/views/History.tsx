import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Luggage } from "lucide-react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { createBooking, getBookings } from "../server/booking";
import { Booking } from "../model/booking";
import { LoadingScreen } from "../components/ui/loading-screen";
import { checkIn, checkOut, reserve } from "../services/customer";
import { normalModal, successModal } from "../utils/helper";
import { orderDetail, tokenDetail } from "../services/public";
import { EmptyPage } from "./EmptyPage";
import { getAccommodations } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";
import { formatEther, parseEther } from "ethers";
import { createRating } from "../server/rating";
import { useNavigate } from "react-router-dom";

interface HistoryPageProps {
  walletProvider: any;
  address: string | undefined;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  walletProvider,
  address,
}) => {
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<{
    tokenId: number;
    image: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const currentDate = Math.floor(Date.now() / 1000);

  const [showRateModal, setShowRateModal] = useState(false);
  const navigate = useNavigate();

  const openModal = (book: Booking) => {
    setSelectedBooking(book);
    setShowRateModal(true);
  };

  const closeModal = () => {
    setShowRateModal(false);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      const filtered = res.filter(
        (book: Booking) => book.userAccount === address!
      );
      if (filtered) {
        const updatedBookings = await Promise.all(
          filtered.map(async (book: Booking, _: any) => {
            const data = await orderDetail(book.id);
            const token = await tokenDetail(book.tokenId);
            const accommodations = await getAccommodations();
            const filteredAccommodation = accommodations.find(
              (accommodation: Accommodation) =>
                accommodation.id === book.accommodationId
            );

            const payment =
              BigInt(parseEther(token.tokenPricePerNight.toString())) *
              BigInt(book.durationInDays);

            return {
              ...book,
              alreadyCheckIn: data.customerAlreadyCheckIn,
              alreadyCheckOut: data.customerAlreadyCheckOut,
              payment: Number(formatEther(payment)),
              checkOut: data.checkOutTimestamp,
              accommodationName: filteredAccommodation.accommodationName,
            };
          })
        );
        setBookingsHistory(updatedBookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const errorScenario = (status: string) => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          `Error while try to ${status}. Please try again later!`
        );
      }, 1000);
    }
  };

  const handleRating = async () => {
    closeModal();
    setLoading(true);
    try {
      const res = await createRating(
        selectedBooking!.accommodationId,
        address!,
        selectedRating
      );
      if (res?.status == 201) {
        normalModal(
          "success",
          "Rated Successfully!",
          "Your feedback is valuable. Thank you for rating!"
        );
        navigate("/");
      } else {
        normalModal(
          "error",
          "Oops...",
          "Error while give a rating. Please try again later!"
        );
      }
    } catch (error) {
      console.log(error);
      normalModal(
        "error",
        "Oops...",
        "Error while give a rating. Please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [update]);

  const handleCheckIn = async (orderId: string) => {
    setLoading(true);
    try {
      const tx = await checkIn(orderId, walletProvider);
      await tx.wait();
      setUpdate(!update);
      setTimeout(() => {
        successModal("Check in successfully!", tx.hash);
      }, 2500);
    } catch (error) {
      console.log(error);
      errorScenario("check in");
    }
  };

  const handleCheckOut = async (orderId: string, tokenId: number) => {
    setLoading(true);
    try {
      const tx = await checkOut(orderId, tokenId, walletProvider);
      await tx.wait();
      setUpdate(!update);
      setTimeout(() => {
        successModal("Check out successfully!", tx.hash);
      }, 2500);
    } catch (error) {
      console.log(error);
      errorScenario("check out");
    }
  };

  const onCreate = async () => {
    setLoading(true);
    try {
      const res = await createBooking(
        "67a034cc36f13875bf0f4523",
        "67a037c070678bba78161acf",
        94,
        address!,
        Math.floor(new Date().getTime() / 1000),
        Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60,
        1
      );
      if (res?.status == 201) {
        const tx = await reserve(
          "67a034cc36f13875bf0f4523",
          res.data.booking._id,
          94,
          1,
          Math.floor(new Date().getTime() / 1000),
          walletProvider
        );
        await tx.wait();
        setLoading(false);
        setTimeout(() => {
          successModal("Book Placed Successfully!", tx.hash);
        }, 2000);
      } else {
        errorScenarioCreateBooking();
      }
    } catch (error) {
      console.log(error);
      errorScenarioCreateBooking();
    }
  };

  const errorScenarioCreateBooking = () => {
    setLoading(false);
    setTimeout(() => {
      normalModal(
        "error",
        "Oops...",
        `Error while try to process your order. Please try again later!`
      );
    }, 1000);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      <button onClick={onCreate}>Create</button>
      <h1 className="text-2xl font-bold text-darkOrange mb-4">
        Booking History
      </h1>
      {bookingsHistory.length > 0 ? (
        <div className="space-y-4">
          {bookingsHistory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 shadow-lg rounded-2xl bg-white flex justify-between items-center border-2 border-brightYellow">
                <CardContent>
                  <p className="text-almostBlack font-semibold">
                    Order ID: {item.id}
                  </p>
                  <p className="text-darkOrange font-semibold">
                    Payment: {item.payment} ETH
                  </p>
                  <p className="text-sm text-gray-500">
                    Accommodation: {item.accommodationName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stays duration: {item.durationInDays} day(s)
                  </p>
                  <p className="text-sm text-gray-500">
                    {`Check-in schedule: ${format(
                      new Date(item.checkIn * 1000),
                      "EEEE, dd MMMM yyyy"
                    )}`}
                  </p>
                  {item.alreadyCheckOut && (
                    <p className="text-sm text-gray-500">
                      Check-out at:{" "}
                      {format(
                        new Date(item.checkOut * 1000),
                        "EEEE, dd MMMM yyyy"
                      )}
                    </p>
                  )}
                </CardContent>
                <div className="flex space-x-2">
                  {item.checkIn <= currentDate && !item.alreadyCheckIn && (
                    <Button
                      onClick={() => handleCheckIn(item.id)}
                      className="bg-primary text-white flex items-center"
                    >
                      <CheckCircle size={16} className="mr-1" /> Check-in
                    </Button>
                  )}
                  {item.alreadyCheckIn && !item.alreadyCheckOut && (
                    <Button
                      onClick={() => handleCheckOut(item.id, item.tokenId)}
                      className="bg-darkOrange text-white flex items-center"
                    >
                      <Luggage size={16} className="mr-1" /> Check-out
                    </Button>
                  )}
                  {item.alreadyCheckIn && item.alreadyCheckOut && (
                    <Button
                      onClick={() => openModal(item)}
                      className="bg-brightYellow text-white flex items-center"
                    >
                      <Luggage size={16} className="mr-1" /> Rate
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setSelectedNFT({ tokenId: item.tokenId, image: "" });
                      setIsModalOpen(true);
                    }}
                    className="bg-complementary text-white flex items-center"
                  >
                    <Eye size={16} className="mr-1" /> Show NFT
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          {selectedBooking && showRateModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-xl font-semibold">
                    Rate your experience
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`text-4xl lg:text-6xl my-8 ${
                          selectedRating >= star
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>{" "}
                <div className="p-3">
                  <button
                    onClick={handleRating}
                    className="p-3 mb-2 bg-brightYellow w-full text-secondary rounded-xl mt-6 font-semibold shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-20">
          <EmptyPage
            title="Whoopss.."
            text="It looks like you haven’t made any bookings yet. Start exploring and create unforgettable memories with us!"
          />
        </div>
      )}

      {/* NFT Modal */}
      {isModalOpen && selectedNFT && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">NFT Details</h2>
              <p>Token ID: {selectedNFT.tokenId}</p>
              <img
                src={selectedNFT.image}
                alt="NFT"
                className="w-64 h-64 object-cover mt-2 rounded-lg"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-darkOrange text-secondary px-4 py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default HistoryPage;
