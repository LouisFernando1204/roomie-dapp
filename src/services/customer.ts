// import { getContractWithSigner } from "./connector";
// import { encodeBytes32String } from "ethers";

// export async function reserve(
//   _lodgeId: string,
//   _orderId: string,
//   _tokenId: string,
//   _days: number,
//   _checkInTimestamp: number,
//   _checkOutTimestamp: number
// ) {
//   const contract = await getContractWithSigner();
//   const transaction = await contract.reserve(
//     encodeBytes32String(_lodgeId),
//     encodeBytes32String(_orderId),
//     _tokenId,
//     _days,
//     _checkInTimestamp,
//     _checkOutTimestamp
//   );
//   return transaction;
// }

// export async function checkIn(_orderId: string) {
//   const contract = await getContractWithSigner();
//   const transaction = await contract.checkIn(encodeBytes32String(_orderId));
//   return transaction;
// }
