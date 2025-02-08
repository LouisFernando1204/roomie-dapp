/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Luggage } from "lucide-react";
import { format } from "date-fns";
import { getBookings } from "../server/booking";
import { Booking } from "../model/booking";
import { LoadingScreen } from "../components/ui/loading-screen";
import { checkIn, checkOut } from "../services/customer";
import { normalModal, successModal } from "../utils/helper";
import { caseDetail, orderDetail, tokenDetail, withdrawForCaseWinner } from "../services/public";
import { EmptyPage } from "./EmptyPage";
import { getAccommodations, getAccommodationById } from "../server/accommodation";
import { Accommodation } from "../model/accommodation";
import { formatEther, parseEther } from "ethers";
import { createRating } from "../server/rating";
import { useNavigate } from "react-router-dom";
import { CreateCaseModal } from "../components/modal/createCaseModal";
import { getCaseByBookingId } from "../server/case";
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
    } finally {
      setLoading(false)
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
    <div className="px-4 md:px-12">
      
      {/* <button onClick={onCreate}>Create</button> */}
      <h1 className="text-2xl font-bold text-darkOrange mb-4 ">
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
                        className="mt-4 w-full shrink-0 rounded-lg bg-complementary px-5 py-2.5 text-base font-medium text-white focus:outline-none sm:mt-0 md:w-auto"
                      >
                        File a case
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
                    {/* <Button
                      onClick={() => {
                        processSelectedNFT(item.roomId, item.tokenId, item.accommodationId, item.accommodationName);
                      }}
                      className="bg-complementary text-white flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> Show NFT
                    </Button> */}
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

      {/* Case Modal */}
      {showCaseModal && (
        <CreateCaseModal setShowCaseModal={setShowCaseModal} accommodation={accommodation} address={address} bookingId={bookingId} accommodationId={accommodationId} loading={loading} setLoading={setLoading} walletProvider={walletProvider} oldCaseName={oldCaseName} />
      )
      }
    </div>
  );
};

export default HistoryPage;
