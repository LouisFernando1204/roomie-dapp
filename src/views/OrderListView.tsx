/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Accommodation } from "../model/accommodation";
import { Booking } from "../model/booking";
import { getBookings } from "../server/booking";
import { LoadingScreen } from "../components/ui/loading-screen";
import { getRoomsById } from "../server/room";
import { EmptyPage } from "./EmptyPage";
import { format } from "date-fns";
import {
  orderDetail,
  tokenDetail,
  caseDetail,
  withdrawForCaseWinner,
} from "../services/public";
import { withdrawFromCustomerCheckOut } from "../services/host";
import { normalModal, successModal } from "../utils/helper";
import { formatEther, parseEther } from "ethers";
import { getCaseByBookingId } from "../server/case";
import { getAccommodationById } from "../server/accommodation";
import { CreateCaseModal } from "../components/modal/createCaseModal";
import Swal from "sweetalert2";

interface OrderListProps {
  accommodation: Accommodation | undefined;
  walletProvider: any;
  address: string | undefined;
}

const OrderList: React.FC<OrderListProps> = ({
  accommodation,
  walletProvider,
  address,
}) => {
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>();
  const [accommodationId, setAccommodationId] = useState<string>();
  const [oldCaseName, setOldCaseName] = useState("");
  const [caseStatuses, setCaseStatuses] = useState<Map<string, string>>(
    new Map()
  );

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      const filtered = res.filter(
        (booking: Booking) => booking.accommodationId === accommodation!.id
      );
      if (filtered) {
        const updatedBookings = await Promise.all(
          filtered.map(async (booking: Booking) => {
            const data = await orderDetail(booking.id);
            const token = await tokenDetail(booking.tokenId);
            const room = await getRoomsById(booking.roomId);

            const payment =
              BigInt(parseEther(token.tokenPricePerNight.toString())) *
              BigInt(booking.durationInDays);

            return {
              ...booking,
              roomType: room!.roomType,
              alreadyCheckIn: data.customerAlreadyCheckIn,
              payment: Number(formatEther(payment)),
              alreadyCheckOut: data.customerAlreadyCheckOut,
              checkOut: data.checkOutTimestamp,
            };
          })
        );
        setBookingsHistory(updatedBookings);
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  };

  const withdraw = async (orderId: string, tokenId: number) => {
    setLoading(true);
    try {
      const tx = await withdrawFromCustomerCheckOut(
        accommodation!.id,
        orderId,
        tokenId,
        walletProvider
      );
      await tx.wait();
      setUpdate(!update);
      setTimeout(() => {
        successModal("Withdraw Succesfully!", tx.hash);
      }, 2500);
    } catch (error) {
      console.log(error);
      errorScenario();
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
            const accommodationCaseMatch = await getAccommodationById(
              specificCase.accommodationCases[0].accommodationId
            );
            if (
              accommodationCaseMatch &&
              accommodationCaseMatch.accommodationHost === address
            ) {
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

  const checkCaseStatus = async (bookingId: string): Promise<string> => {
    setLoading(true);
    try {
      const specificCase = await getCaseByBookingId(bookingId);
      if (specificCase) {
        const caseDetailData = await caseDetail(specificCase.id);
        if (caseDetailData) {
          if (
            caseDetailData.caseCreatedTimestamp &&
            caseDetailData.totalCustomerVote &&
            caseDetailData.totalHostVote
          ) {
            const caseTimestampMs = caseDetailData.caseCreatedTimestamp * 1000;
            const now = Date.now();
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

            if (
              now - caseTimestampMs > sevenDaysMs &&
              caseDetailData.totalCustomerVote > caseDetailData.totalHostVote
            ) {
              return "customer wins";
            }
            if (
              now - caseTimestampMs > sevenDaysMs &&
              caseDetailData.totalCustomerVote < caseDetailData.totalHostVote
            ) {
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
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Withdraw",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-modal",
        confirmButton: "swal-confirm-button swal-wide-button",
        cancelButton: "swal-cancel-button swal-wide-button",
        actions: "swal-two-buttons",
      },
      buttonsStyling: false,
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

  const errorScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while withdraw. Please try again later!"
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

  useEffect(() => {
    fetchBookings();
  }, [accommodation, update]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="px-4 md:px-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-darkOrange">
          {accommodation!.accommodationName} Order List
        </h1>
      </div>
      {bookingsHistory.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-darkOrange">
            <thead className="text-xs text-gray-900 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Booking time
                </th>
                <th scope="col" className="px-6 py-3">
                  Charge (ETH)
                </th>
                <th scope="col" className="px-6 py-3">
                  Earnings (ETH)
                </th>
                <th scope="col" className="px-6 py-3">
                  Check in
                </th>
                <th scope="col" className="px-6 py-3">
                  Stay Duration (days)
                </th>
                <th scope="col" className="px-6 py-3">
                  Check out
                </th>
                <th scope="col" className="px-6 py-3">
                  Room Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Token ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Account
                </th>
                <th scope="col" className="px-6 py-3">
                  Case
                </th>
                <th scope="col" className="px-6 py-3">
                  Withdraw
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingsHistory.map((order: Booking) => {
                const caseStatus = caseStatuses.get(order.id);
                return (
                  <tr
                    key={order.id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(order.bookingTimestamp * 1000), "PPpp")}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.payment}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.payment * 2}
                    </td>
                    <td className="px-6 py-4">
                      {format(
                        new Date(order.checkIn * 1000),
                        "EEEE, dd MMMM yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4">{order.durationInDays}</td>
                    <td className="px-6 py-4">
                      {`${
                        order.checkOut !== 0
                          ? `${format(
                              new Date(order.bookingTimestamp * 1000),
                              "EEEE, dd MMMM yyyy"
                            )}`
                          : `-`
                      }`}
                    </td>
                    <td className="px-6 py-4">{order.roomType}</td>
                    <td className="px-6 py-4">{order.tokenId}</td>
                    <td className="px-6 py-4">{order.userAccount}</td>
                    <td className="px-6 py-4">
                      {caseStatus === "host wins" ? (
                        <button
                          onClick={() =>
                            handleWithdrawCase(order.id, order.tokenId)
                          }
                          type="button"
                          className="mt-4 w-full shrink-0 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-darkYellow focus:outline-none sm:mt-0 md:w-auto"
                        >
                          Withdraw For Case Wins
                        </button>
                      ) : (
                        <button
                          onClick={() => checkAlreadyLodgeACase(order)}
                          type="button"
                          className="mt-4 w-full shrink-0 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-darkYellow focus:outline-none sm:mt-0 md:w-auto"
                        >
                          File a case
                        </button>
                      )}
                    </td>
                    <td
                      onClick={() => {
                        if (order.alreadyCheckOut) {
                          withdraw(order.id, order.tokenId);
                        }
                      }}
                      className={`px-6 py-4 hover:underline cursor-pointer ${
                        !order.alreadyCheckOut
                          ? "text-gray-400"
                          : "text-complementary"
                      }`}
                    >
                      {order.alreadyCheckOut
                        ? "Withdraw"
                        : "Withdrawal is unavailable until the user checks out."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyPage
          title="Oops!"
          text="It looks like your accommodation doesn’t have any bookings yet. Don’t worry, there’s always a first time!"
        />
      )}

      {/* Case Modal */}
      {showCaseModal && (
        <CreateCaseModal
          setShowCaseModal={setShowCaseModal}
          accommodation={accommodation}
          address={address}
          bookingId={bookingId}
          accommodationId={accommodationId}
          loading={loading}
          setLoading={setLoading}
          walletProvider={walletProvider}
          oldCaseName={oldCaseName}
        />
      )}
    </div>
  );
};

export default OrderList;
