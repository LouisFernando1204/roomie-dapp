/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Luggage } from "lucide-react";
import { format } from "date-fns";
import { createBooking, getBookings } from "../server/booking";
import { Booking } from "../model/booking";
import { LoadingScreen } from "../components/ui/loading-screen";
import { checkIn, checkOut, reserve } from "../services/customer";
import { normalModal, successModal, truncate } from "../utils/helper";
import { caseDetail, orderDetail, tokenDetail, withdrawForCaseWinner } from "../services/public";
import { EmptyPage } from "./EmptyPage";
import { getAccommodations, getAccommodationById } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";
import { formatEther, parseEther } from "ethers";
import { createRating } from "../server/rating";
import { useNavigate } from "react-router-dom";
import { CreateCaseModal } from "../components/modal/createCaseModal";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { getCaseByBookingId } from "../server/case";
import { getRoomsById } from "../server/room";
import Swal from "sweetalert2";

interface HistoryPageProps {
  walletProvider: any;
  address: string | undefined;
  accommodation: Accommodation | undefined;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  walletProvider,
  address,
  accommodation
}) => {
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<{
    name: string;
    token_id: number;
    price_per_night_in_eth: number;
    accommodation_id: string;
    accommodation_name: string;
    image: string;
    description: string;
    facilities: string[];
    bedType: string;
    maxPeople: string;
    blockchain: string;
    contract_address: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const currentDate = Math.floor(Date.now() / 1000);

  const [showRateModal, setShowRateModal] = useState(false);

  const [showCaseModal, setShowCaseModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>();
  const [accommodationId, setAccommodationId] = useState<string>();
  const [oldCaseName, setOldCaseName] = useState("");
  const [caseStatuses, setCaseStatuses] = useState<Map<string, string>>(new Map());

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

  const getOldCaseName = async (bookingId: string) => {
    setLoading(true);
    try {
      const caseData = await getCaseByBookingId(bookingId);
      if (caseData) {
        setLoading(false);
        setOldCaseName(caseData.name);
        setShowCaseModal(true);
      } else {
        setLoading(false);
        setShowCaseModal(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAlreadyLodgeACase = async (booking: Booking) => {
    setLoading(true);
    try {
      const specificCase = await getCaseByBookingId(booking.id);
      if (specificCase != null) {
        if (accommodation != null) {
          if (specificCase.accommodationCases.length > 0) {
            const accommodationCaseMatch = await getAccommodationById(specificCase.accommodationCases[0].accommodationId);
            if (accommodationCaseMatch && accommodationCaseMatch.accommodationHost === address) {
              setLoading(false);
              alreadyLodgeACasePopUp();
              return;
            }
          }
        } else {
          if (specificCase.userCases.length > 0) {
            const userCaseMatch = specificCase.userCases.find(
              (userCase: {
                id: string;
                userAccount: string;
                userArgument: string;
                userEvidence: string;
                createdAt: string;
              }) => userCase.userAccount === address
            );
            if (userCaseMatch) {
              setLoading(false);
              alreadyLodgeACasePopUp();
              return;
            }
          }
        }
      }
      setBookingId(booking.id);
      setAccommodationId(booking.accommodationId);
      getOldCaseName(booking.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processSelectedNFT = async (roomId: string, tokenId: number, accommodationId: string, accommodationName: string) => {
    setLoading(true);
    try {
      const roomData = await getRoomsById(roomId);
      if (roomData) {
        setLoading(false);
        setSelectedNFT({
          name: roomData.roomType,
          token_id: tokenId,
          price_per_night_in_eth: roomData.price,
          accommodation_id: accommodationId,
          accommodation_name: accommodationName,
          image: roomData.imageUrls[0],
          description: roomData.roomDescription,
          facilities: roomData.facilities,
          bedType: roomData.bedSize,
          maxPeople: roomData.maxOccupancy,
          blockchain: "Manta Pacific",
          contract_address: import.meta.env.VITE_CONTRACT_ADDRESS
        });
        setIsModalOpen(true);
        console.log(selectedNFT)
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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
        "67a30ad95e9ad21eb839873e",
        "67a394991bf6a7032f11d754",
        2,
        address!,
        Math.floor(new Date().getTime() / 1000),
        Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60,
        1
      );
      if (res?.status == 201) {
        const tx = await reserve(
          "67a30ad95e9ad21eb839873e",
          res.data.booking._id,
          2,
          1,
          Math.floor(new Date().getTime() / 1000),
          walletProvider
        );
        await tx.wait();
        setLoading(false);
        setUpdate(!update);
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

  const checkCaseStatus = async (bookingId: string): Promise<string> => {
    setLoading(true);
    try {
      const specificCase = await getCaseByBookingId(bookingId);
      if (specificCase) {
        const caseDetailData = await caseDetail(specificCase.id);
        if (caseDetailData) {
          if (caseDetailData.caseCreatedTimestamp && caseDetailData.totalCustomerVote && caseDetailData.totalHostVote) {
            const caseTimestampMs = caseDetailData.caseCreatedTimestamp * 1000;
            const now = Date.now();
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

            if ((now - caseTimestampMs > sevenDaysMs) && (caseDetailData.totalCustomerVote > caseDetailData.totalHostVote)) {
              return "customer wins";
            }
            if ((now - caseTimestampMs > sevenDaysMs) && (caseDetailData.totalCustomerVote < caseDetailData.totalHostVote)) {
              return "host wins";
            }
            return "still in progress";
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return "error";
  };

  const withdrawCase = async (bookingId: string, tokenId: number) => {
    console.log(bookingId);
    console.log(tokenId);
    setLoading(true);
    try {
      const specificCase = await getCaseByBookingId(bookingId);
      if (specificCase) {
        const tx = await withdrawForCaseWinner(
          specificCase.id,
          bookingId,
          tokenId,
          walletProvider
        );
        const receipt = await tx.wait();
        if (receipt) {
          setUpdate(!update);
          successModal("Withdraw Successfully!", tx.hash);
        } else {
          setLoading(false);
          errorWithdrawCaseScenario();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      errorWithdrawCaseScenario();
    }
  };

  const handleWithdrawCase = async (bookingId: string, tokenId: number) => {
    const result = await Swal.fire({
      html: `
          <div style="text-align: center;">
            <p>Are you sure you want to withdraw this case?</p>
          </div>
        `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Withdraw',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-modal',
        confirmButton: 'swal-confirm-button swal-wide-button',
        cancelButton: 'swal-cancel-button swal-wide-button',
        actions: 'swal-two-buttons'
      },
      buttonsStyling: false
    });

    if (result.isDismissed) {
      console.log("Cancel withdraw.");
    } else {
      console.log(`Confirm withdraw for this case.`);
      withdrawCase(bookingId, tokenId);
    }
  };

  const errorWithdrawCaseScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          `Error while trying to withdraw this case. Please try again later!`
        );
      }, 1000);
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

  const alreadyLodgeACasePopUp = () => {
    setLoading(false);
    setTimeout(() => {
      normalModal(
        "error",
        "Oops...",
        `"You've already lodged a case. Only one case can be submitted!`
      );
    }, 1000);
  };

  useEffect(() => {
    fetchBookings();
  }, [update]);

  useEffect(() => {
    const fetchCaseStatuses = async () => {
      const newCaseStatuses = new Map<string, string>();
      for (const booking of bookingsHistory) {
        const status = await checkCaseStatus(booking.id);
        newCaseStatuses.set(booking.id, status);
      }
      setCaseStatuses(newCaseStatuses);
    };
    fetchCaseStatuses();
  }, [bookingsHistory]);

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
          {bookingsHistory.map((item: Booking) => {
            const caseStatus = caseStatuses.get(item.id);
            return (
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
                    {caseStatus === "customer wins" ? (
                      <button
                        onClick={() => handleWithdrawCase(item.id, item.tokenId)}
                        type="button"
                        className="mt-4 w-full shrink-0 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-darkYellow focus:outline-none sm:mt-0 md:w-auto"
                      >
                        Withdraw For Case Wins
                      </button>
                    ) : (
                      <button
                        onClick={() => checkAlreadyLodgeACase(item)}
                        type="button"
                        className="mt-4 w-full shrink-0 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-darkYellow focus:outline-none sm:mt-0 md:w-auto"
                      >
                        Lodge a case
                      </button>
                    )}
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
                        processSelectedNFT(item.roomId, item.tokenId, item.accommodationId, item.accommodationName);
                      }}
                      className="bg-complementary text-white flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> Show NFT
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
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
                        className={`text-4xl lg:text-6xl my-8 ${selectedRating >= star
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
        <div className="fixed flex items-center justify-center w-screen h-screen inset-0 bg-black bg-opacity-50 p-4 z-50">
          <CardSpotlight
            data-aos="zoom-in-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="300"
            className="h-fit w-full sm:w-9/12 lg:w-4/12 relative bg-black rounded-xl shadow-lg p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-almostBlack text-gray-500 hover:bg-gray-900 hover:text-gray-300 transition z-50"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-darkOrange to-primary rounded-lg p-2 flex items-center justify-center z-20">
              <svg className="w-6 h-6 text-white mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.89 12.7l-4.11-2 4.11-2 2-4.1 2 4.1 4.1 2-4.1 2-2 4.1z"></path>
              </svg>
              <span className="text-white font-bold text-lg">{selectedNFT.name}</span>
            </div>
            {/* Image Section */}
            <div className="mt-4">
              <img
                src={selectedNFT.image}
                alt={selectedNFT.name}
                className="relative w-full h-52 object-cover rounded-lg border border-primary z-20"
              />
            </div>
            {/* Details Section */}
            <div className="relative mt-4 bg-almostBlack p-3 rounded-lg border border-primary z-20">
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex justify-between">
                  <span>Name</span>
                  <span className="text-yellow-400 font-semibold">{selectedNFT.name}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Token Id</span>
                  <span>{selectedNFT.token_id}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Price Per Night</span>
                  <span>{selectedNFT.price_per_night_in_eth}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Accommodation Id</span>
                  <span>{selectedNFT.accommodation_id}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Accommodation Name</span>
                  <span>{selectedNFT.accommodation_name}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Description</span>
                  <span>{selectedNFT.description}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Facilities</span>
                  <span>{selectedNFT.facilities.join(', ')}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Bed Type</span>
                  <span>{selectedNFT.bedType}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Max People</span>
                  <span>{selectedNFT.maxPeople}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Blockchain</span>
                  <span>{selectedNFT.blockchain}</span>
                </li>
                <hr className="border-t border-gray-300" />
                <li className="flex justify-between">
                  <span>Contract Address</span>
                  <span>{truncate(selectedNFT.contract_address, 10, 10, 24)}</span>
                </li>
              </ul>
            </div>
            {/* Footer */}
            <div className="relative mt-4 flex justify-center items-center text-gray-400 z-20">
              <img src="/images/roomie_logo.jpg" alt="Roomie Logo" className="w-8 h-8 mr-2" />
              <span className="text-base font-semibold">Roomie</span>
            </div>
          </CardSpotlight>
        </div>
      )}
      {/* Case Modal */}
      {showCaseModal && (
        <CreateCaseModal setShowCaseModal={setShowCaseModal} accommodation={accommodation} address={address} bookingId={bookingId} accommodationId={accommodationId} loading={loading} setLoading={setLoading} walletProvider={walletProvider} oldCaseName={oldCaseName} />
      )
      }
    </div>
  );
};

export default HistoryPage;
