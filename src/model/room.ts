export interface Room {
  id: string;
  tokenId: number;
  accommodationId: string;
  roomType: string;
  roomDescription: string;
  facilities: string[];
  price: number;
  bedSize: string;
  maxOccupancy: number;
  imageUrls: string[];
}
