/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BACKEND_API_URL } from "../global/global";

export async function createAccommodation(
  _accommodationHost: string,
  _accommodationName: string,
  _accommodationType: string,
  _address: string,
  _logoImageUrl: string,
  _coverImageUrl: string
) {
  try {
    const res = await axios.post(`${BACKEND_API_URL}accommodations`, {
      accommodationHost: _accommodationHost,
      accommodationName: _accommodationName,
      accommodationType: _accommodationType,
      address: _address,
      logoImageUrl: _logoImageUrl,
      coverImageUrl: _coverImageUrl,
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function updateAccommodation(
  _id: string,
  _accommodationName: string,
  _accommodationType: string,
  _address: string,
  _logoImageUrl: string,
  _coverImageUrl: string
) {
  try {
    const res = await axios.put(`${BACKEND_API_URL}accommodations`, {
      id: _id,
      accommodationName: _accommodationName,
      accommodationType: _accommodationType,
      address: _address,
      logoImageUrl: _logoImageUrl,
      coverImageUrl: _coverImageUrl,
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function deleteAccommodation(_id: string) {
  try {
    await axios.delete(`${BACKEND_API_URL}accommodations`, {
      data: {
        id: _id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getAccommodations() {
  try {
    const res = await axios.get(`${BACKEND_API_URL}accommodations`);
    return structuredAccommodations(res.data);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getAccommodationById(_id: string) {
  try {
    const res = await axios.get(`${BACKEND_API_URL}accommodations/${_id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return;
  }
}

function structuredAccommodations(accommodations: any) {
  return accommodations.map((accommodation: any) => ({
    id: accommodation._id,
    rating: 0,
    accommodationHost: accommodation.accommodationHost,
    accommodationName: accommodation.accommodationName,
    accommodationType: accommodation.accommodationType,
    address: accommodation.address,
    logoImageUrl: accommodation.logoImageUrl,
    coverImageUrl: accommodation.coverImageUrl
  }))
}
