export interface Room {
  id: string;
  tokenId: number;
  tokenMetadata: string; 
  accommodationId: string;
  roomType: string;
  roomDescription: string;
  facilities: string[];
  price: number;
  bedSize: string;
  maxOccupancy: number;
  imageUrls: string[];
  supply: number;
  burn: number;
}
