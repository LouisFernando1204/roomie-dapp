"use client";
import React, { useState } from "react";

interface Room {
    roomType: string;
    tokenID: number;
    total: number;
    available: number;
    occupied: number;
    bedType: string;
    maxPeople: number;
    originalPrice: number;
    facilities: string[];
    image: string[];
}

const RoomList = () => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [showModal, setShowModal] = useState(false);

    const dummyData = {
        roomListRows: [
            {
                roomType: 'Jomblo',
                tokenID: 1,
                total: 30,
                available: 24,
                occupied: 6,
                bedType: 'Single',
                maxPeople: 1,
                originalPrice: 1000,
                facilities: ['Free wifi', 'yang sabar ya bro'],
                image: ['/images/hotel_pic.jpg']
            },
            {
                roomType: 'Double',
                tokenID: 2,
                total: 30,
                available: 20,
                occupied: 10,
                bedType: 'Queen',
                maxPeople: 2,
                originalPrice: 2000,
                facilities: ['yah standar aja lah bro'],
                image: ['/images/hotel_pic.jpg', '/images/hotel_pic.jpg', '/images/hotel_pic.jpg', '/images/hotel_pic.jpg']
            },
            {
                roomType: 'Twin',
                tokenID: 3,
                total: 30,
                available: 24,
                occupied: 6,
                bedType: 'Twin',
                maxPeople: 2,
                originalPrice: 2500,
                facilities: ['no joren allowed', 'kita pisahan kasur'],
                image: ['/images/hotel_pic.jpg']
            },
            {
                roomType: 'Suite',
                tokenID: 4,
                total: 30,
                available: 24,
                occupied: 6,
                bedType: 'Kasur Emas',
                maxPeople: 10,
                originalPrice: 30000,
                facilities: ['Free Breakfast', 'Kitchenette', 'Free Dinner', 'Free Laundry'],
                image: ['/images/hotel_pic.jpg']
            },
        ] as Room[],
    };

    const openModal = (room: Room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    return (
        <div className="">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-darkOrange">Your Room List</h1>
                <p className="text-sm text-gray-500">Hotel Termewah di Tata Surya</p>
            </div>

            <div className="mb-8 relative overflow-x-auto shadow-md sm:rounded-lg bg-brightYellow">
                <table className="w-full text-sm text-left rtl:text-right text-darkOrange">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Room type</th>
                            <th scope="col" className="px-6 py-3">Token ID</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Available</th>
                            <th scope="col" className="px-6 py-3">Occupied</th>
                            <th scope="col" className="px-6 py-3">Bed Type</th>
                            <th scope="col" className="px-6 py-3">Max People</th>
                            <th scope="col" className="px-6 py-3">Price (ETH)</th>
                            <th scope="col" className="px-6 py-3">Facilities</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyData.roomListRows.map((room, index) => (
                            <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{room.roomType}</td>
                                <td className="px-6 py-4">{room.tokenID}</td>
                                <td className="px-6 py-4">{room.total}</td>
                                <td className="px-6 py-4">{room.available}</td>
                                <td className="px-6 py-4">{room.occupied}</td>
                                <td className="px-6 py-4">{room.bedType}</td>
                                <td className="px-6 py-4">{room.maxPeople}</td>
                                <td className="px-6 py-4">{room.originalPrice}</td>
                                <td className="px-6 py-4">{room.facilities.join(', ')}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openModal(room)}
                                        className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-600 rounded-lg text-sm"
                                    >
                                        Images
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedRoom && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold">{selectedRoom.roomType}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4">
                            {selectedRoom.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Room ${selectedRoom.roomType} view ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomList;