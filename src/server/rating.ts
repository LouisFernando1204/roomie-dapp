import axios from "axios";
import { BACKEND_API_URL } from "../global/global";

export async function createRating(
  _accommodationId: string,
  _userAccount: string,
  _rating: number
) {
  try {
    const res = await axios.post(`${BACKEND_API_URL}ratings`, {
      accommodationId: _accommodationId,
      userAccount: _userAccount,
      rating: _rating,
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getAccommodationRating(_id: string) {
  try {
    const res = await axios.get(
      `${BACKEND_API_URL}ratings/accommodation/${_id}`
    );
    return res.data.averageRating || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
