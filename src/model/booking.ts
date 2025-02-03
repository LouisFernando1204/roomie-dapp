export interface Booking{
  id: string;
  accommodationId: string;
  accommodationName: string;
  roomId: string;
  roomType: string;
  tokenId: number;
  payment: number;
  userAccount: string;
  checkIn: number;
  checkOut: number;
  bookingTimestamp: number;
  durationInDays: number;
  alreadyCheckIn: boolean;
  alreadyCheckOut: boolean;
}
