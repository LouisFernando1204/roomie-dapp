import { encodeBytes32String, parseEther } from "ethers";
import { getContractWithSigner } from "./connector";
import { tokenDetail } from "./public";

export async function reserve(
  _lodgeId: string,
  _orderId: string,
  _tokenId: number,
  _days: number,
  _checkInTimestamp: number,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const tokenPrice = (await tokenDetail(_tokenId)).tokenPricePerNight;
  const deposit = BigInt(_days) * BigInt(parseEther(tokenPrice.toString()));
  const transaction = await contract.reserve(
    encodeBytes32String(_lodgeId),
    encodeBytes32String(_orderId),
    _tokenId,
    _days,
    _checkInTimestamp,
    {
      value: deposit,
    }
  );
  return transaction;
}

export async function checkIn(_orderId: string, _walletProvider: any) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.checkIn(encodeBytes32String(_orderId));
  return transaction;
}

export async function checkOut(_orderId: string, _tokenId: number, _walletProvider: any) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.checkOut(encodeBytes32String(_orderId), _tokenId);
  return transaction;
}
