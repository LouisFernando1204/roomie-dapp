/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Accommodation } from "../model/accommodation";
import { Booking } from "../model/booking";
import { getBookings } from "../server/booking";
import { LoadingScreen } from "../components/ui/loading-screen";
import { getRoomsById } from "../server/room";
import { EmptyPage } from "./EmptyPage";
import { format } from "date-fns";
import { orderDetail, tokenDetail } from "../services/public";
import { withdrawFromCustomerCheckOut } from "../services/host";
import { normalModal, successModal } from "../utils/helper";
import { formatEther, parseEther } from "ethers";

interface OrderListProps {
  accommodation: Accommodation | undefined;
  walletProvider: any;
}

const OrderList: React.FC<OrderListProps> = ({
  accommodation,
  walletProvider,
}) => {
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

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
              roomType: room.roomType,
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
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchBookings();
  }, [accommodation, update]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingsHistory.map((order: Booking) => (
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
                  <td className="px-6 py-4">{`${
                    order.checkOut != 0
                      ? `${format(
                          new Date(order.bookingTimestamp * 1000),
                          "EEEE, dd MMMM yyyy"
                        )}`
                      : `-`
                  }`}</td>
                  <td className="px-6 py-4">{order.roomType}</td>
                  <td className="px-6 py-4">{order.tokenId}</td>
                  <td className="px-6 py-4">{order.userAccount}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyPage
          title="Oops!"
          text="It looks like your accommodation doesn’t have any bookings yet. Don’t worry, there’s always a first time!"
        />
      )}
    </div>
  );
};

export default OrderList;
