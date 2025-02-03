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
import { orderDetail } from "../services/public";
import { EmptyPage } from "./EmptyPage";
import { getAccommodations } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";

interface HistoryPageProps {
  walletProvider: any;
  address: string | undefined;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  walletProvider,
  address,
}) => {
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<{
    tokenId: number;
    image: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const currentDate = Math.floor(Date.now() / 1000);

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
            const accommodations = await getAccommodations();
            const filteredAccommodation = accommodations.find(
              (accommodation: Accommodation) =>
                accommodation.id === book.accommodationId
            );
            return {
              ...book,
              alreadyCheckIn: data.customerAlreadyCheckIn,
              alreadyCheckOut: data.customerAlreadyCheckOut,
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

  useEffect(() => {
    fetchBookings();
  }, [update]);

  const handleCheckIn = async (orderId: string) => {
    setLoading(true);
    try {
      const tx = await checkIn(orderId, walletProvider);
      const receipt = await tx.wait();
      if (receipt) {
        setUpdate(!update);
        setTimeout(() => {
          successModal("Check in successfully!", tx.hash);
        }, 2500);
      } else {
        errorScenario("check in");
      }
    } catch (error) {
      console.log(error);
      errorScenario("check in");
    }
  };

  const handleCheckOut = async (orderId: string, tokenId: number) => {
    setLoading(true);
    try {
      const tx = await checkOut(orderId, tokenId, walletProvider);
      const receipt = await tx.wait();
      if (receipt) {
        setUpdate(!update);
        setTimeout(() => {
          successModal("Check out successfully!", tx.hash);
        }, 2500);
      }
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
        const receipt = await tx.wait();
        if (receipt) {
          setLoading(false);
          setTimeout(() => {
            successModal("Book Placed Successfully!", tx.hash);
          }, 2000);
        } else {
          errorScenarioCreateBooking();
        }
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
                  <p className="text-sm text-gray-500">
                    Accommodation: {item.accommodationName}
                  </p>
                  <p className="text-sm text-gray-500">
                    User: {item.userAccount}
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
                      {format(new Date(item.checkOut * 1000), "PPpp")}
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
                      onClick={() => handleCheckOut(item.id, item.tokenId)}
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
