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
    const res = await axios.post(`${BACKEND_API_URL}`, {
      accommodationId: _accommodationId,
      roomId: _roomId,
      tokenId: _tokenId,
      userAccount: _userAccount,
      checkIn: _checkIn,
      checkOut: _checkOut,
      durationInDays: _durationInDays
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getBookings() {
  try {
    const res = await axios.get(`${BACKEND_API_URL}bookings`);
    return res.data;
  } catch (error) {
    console.log(error);
    return;
  }
}
