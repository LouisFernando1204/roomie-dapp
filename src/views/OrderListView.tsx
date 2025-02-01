"use client";
import React, { useState } from "react";

const OrderList = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dummyData = {
    orderListRows: [
      { 
        id: 1, 
        roomID: 1, 
        tokenID: 1, 
        customerName: 'Andi', 
        startDate: '2022-10-10', 
        endDate: '2022-10-15', 
        days: 5, 
        bookingTime: 'kemaren' 
      },
      { 
        id: 2, 
        roomID: 1, 
        tokenID: 1, 
        customerName: 'Agus', 
        startDate: '2022-10-10', 
        endDate: '2022-10-16', 
        days: 6, 
        bookingTime: '2022-10-8' 
      }
    ],
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-darkOrange">Your Order List</h1>
        <p className="text-sm text-gray-500">Hotel Termewah di Tata Surya</p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-darkOrange">
          <thead className="text-xs text-gray-900 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Room ID</th>
              <th scope="col" className="px-6 py-3">Token ID</th>
              <th scope="col" className="px-6 py-3">Customer name</th>
              <th scope="col" className="px-6 py-3">Check in</th>
              <th scope="col" className="px-6 py-3">Check out</th>
              <th scope="col" className="px-6 py-3">Days</th>
              <th scope="col" className="px-6 py-3">Booking time</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.orderListRows.map((order) => (
              <tr key={order.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4">{order.roomID}</td>
                <td className="px-6 py-4">{order.tokenID}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{order.startDate}</td>
                <td className="px-6 py-4">{order.endDate}</td>
                <td className="px-6 py-4">{order.days}</td>
                <td className="px-6 py-4">{order.bookingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;