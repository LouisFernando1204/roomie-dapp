export interface Booking{
  id: string;
  roomId: string;
  tokenId: number;
  userAccount: string;
  checkIn: number;
  checkOut: number;
  durationInDays: number;
}
