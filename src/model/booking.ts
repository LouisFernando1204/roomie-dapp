export interface Booking{
  id: string;
  accommodationId: string;
  accommodationName: string;
  roomId: string;
  tokenId: number;
  userAccount: string;
  checkIn: number;
  checkOut: number;
  durationInDays: number;
  alreadyCheckIn: boolean;
  alreadyCheckOut: boolean;
}
