"use client";
import React, { useEffect, useState, Suspense } from "react";

const RoomList = () => {
    const [errorMessage, setErrorMessage] = useState(null); // Define errorMessage to avoid undefined error

    const dummyData = {
        roomListRows: [
            { roomType: 'Jomblo', tokenID: 1, total: 30, available: 24, occupied: 6, bedType: 'Single', maxPeople: 1, originalPrice: 1000, facilities: ['Free wifi', 'yang sabar ya bro'], image: ['public\images\hotel_pic.jpg'] },
            { roomType: 'Double', tokenID: 2, total: 30, available: 20, occupied: 10, bedType: 'Queen', maxPeople: 2, originalPrice: 2000, facilities: ['yah standar aja lah bro'], image: ['public\images\hotel_pic.jpg', 'public\images\hotel_pic.jpg'] },
            { roomType: 'Twin', tokenID: 3, total: 30, available: 24, occupied: 6, bedType: 'Twin', maxPeople: 2, originalPrice: 2500, facilities: ['no joren allowed', 'kita pisahan kasur'], image: ['public\images\hotel_pic.jpg'] },
            { roomType: 'Suite', tokenID: 4, total: 30, available: 24, occupied: 6, bedType: 'Kasur Emas', maxPeople: 10, originalPrice: 30000, facilities: ['Free Breakfast', 'Kitchenette', 'Free Dinner', 'Free Laundry'], image: ['public\images\hotel_pic.jpg'] },

        ],
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-darkOrange">Your Room List</h1>
                <p className="text-sm text-gray-500">Hotel Termewah di Tata Surya</p>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-brightYellow">
                <table className="w-full text-sm text-left rtl:text-right text-darkOrange">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Room type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Token ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Available
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Occupied
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Bed Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Max People
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price (ETH) 
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Facilities
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Mint</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyData.roomListRows.map((room, index) => (
                            <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {room.roomType}
                                </th>
                                <td className="px-6 py-4">
                                    {room.tokenID}
                                </td>
                                <td className="px-6 py-4">
                                    {room.total}
                                </td>
                                <td className="px-6 py-4">
                                    {room.available}
                                </td>
                                <td className="px-6 py-4">
                                    {room.occupied}
                                </td>
                                <td className="px-6 py-4">
                                    {room.bedType}
                                </td>
                                <td className="px-6 py-4">
                                    {room.maxPeople}
                                </td>
                                <td className="px-6 py-4">
                                    {room.originalPrice}
                                </td>
                                <td className="px-6 py-4">
                                    {room.facilities.join(', ')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-complementary hover:underline">Mint</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default RoomList