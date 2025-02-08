/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BACKEND_API_URL } from "../global/global";

export async function createBooking(
  _accommodationId: string,
  _roomId: string,
  _tokenId: number,
  _userAccount: string,
  _checkIn: number,
  _checkOut: number,
  _durationInDays: number
) {
  try {
    const res = await axios.post(`${BACKEND_API_URL}bookings`, {
      accommodationId: _accommodationId,
      roomId: _roomId,
      tokenId: _tokenId,
      userAccount: _userAccount,
      checkIn: _checkIn,
      checkOut: _checkOut,
      durationInDays: _durationInDays,
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function deleteBooking(_id: string) {
  try {
    await axios.delete(`${BACKEND_API_URL}bookings`, {
      data: {
        id: _id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getBookings() {
  try {
    const res = await axios.get(`${BACKEND_API_URL}bookings`);
    return structuredBookings(res.data);
  } catch (error) {
    console.log(error);
    return;
  }
}

function structuredBookings(bookings: any) {
  return bookings.map((booking: any) => ({
    id: booking._id,
    accommodationId: booking.accommodationId,
    roomId: booking.roomId,
    roomType: "",
    tokenId: booking.tokenId,
    userAccount: booking.userAccount,
    checkIn: booking.checkIn,
    checkOut: 0,
    payment: 0,
    bookingTimestamp: booking.bookingTimestamp,
    durationInDays: booking.durationInDays,
    alreadyCheckIn: false,
    alreadyCheckOut: false,
  }));
}
