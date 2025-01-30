import { getContractWithSigner } from "./connector";

export async function reserve(
  _lodgeId: string,
  _orderId: string,
  _tokenId: string,
  _days: number,
  _checkInTimestamp: number,
  _checkOutTimestamp: number
) {
    const contract = await getContractWithSigner();
    const transaction = await contract.reserve();
}

export async function checkIn(_orderId: string) {
    const contract = await getContractWithSigner();
    const transaction = await contract.checkIn();
}
