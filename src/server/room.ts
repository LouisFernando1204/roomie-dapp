/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BACKEND_API_URL } from "../global/global";

export async function createRoom(
  _tokenId: number,
  _accommodationId: string,
  _roomType: string,
  _roomDescription: string,
  _facilities: string[],
  _price: number,
  _bedSize: string,
  _maxOccupancy: number,
  _imageUrls: string[]
) {
  try {
    const res = await axios.post(`${BACKEND_API_URL}rooms`, {
      tokenId: _tokenId,
      accommodationId: _accommodationId,
      roomType: _roomType,
      roomDescription: _roomDescription,
      facilities: _facilities,
      price: _price,
      bedSize: _bedSize,
      maxOccupancy: _maxOccupancy,
      imageUrls: _imageUrls,
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getRooms() {
  try {
    const res = await axios.get(`${BACKEND_API_URL}rooms`);
    return structuredRooms(res.data);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function deleteRoom(_id: string) {
  try {
    await axios.delete(`${BACKEND_API_URL}rooms`, {
      data: {
        id: _id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getRoomsById(_id: string) {
  try {
    const res = await axios.get(`${BACKEND_API_URL}rooms/${_id}`);
    return structuredRoom(res.data);
  } catch (error) {
    console.log(error);
    return;
  }
}

function structuredRoom(room: any) {
  return {
    id: room._id,
    tokenId: room.tokenId,
    tokenMetadata: "",
    accommodationId: room.accommodationId,
    accommodationName: "",
    address: "",
    roomType: room.roomType,
    roomDescription: room.roomDescription,
    facilities: room.facilities,
    price: room.price,
    bedSize: room.bedSize,
    maxOccupancy: room.maxOccupancy,
    imageUrls: room.imageUrls,
    supply: 0,
    burn: 0,
  };
}

function structuredRooms(rooms: any) {
  return rooms.map((room: any) => ({
    id: room._id,
    tokenId: room.tokenId,
    tokenMetadata: "",
    accommodationId: room.accommodationId,
    accommodationName: "",
    address: "",
    roomType: room.roomType,
    roomDescription: room.roomDescription,
    facilities: room.facilities,
    price: room.price,
    bedSize: room.bedSize,
    maxOccupancy: room.maxOccupancy,
    imageUrls: room.imageUrls,
    supply: 0,
    burn: 0,
  }));
}
