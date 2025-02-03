import { encodeBytes32String, parseEther, toUtf8Bytes } from "ethers";
import { getContractWithSigner } from "./connector";
import { tokenDetail } from "./public";

export async function registerLodge(_lodgeId: string, _walletProvider: any) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.registerLodge(
    encodeBytes32String(_lodgeId)
  );
  return transaction;
}

export async function registerToken(
  _lodgeId: string,
  _tokenURI: string,
  _tokenId: number,
  _tokenPrice: string,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.registerToken(
    encodeBytes32String(_lodgeId),
    _tokenURI,
    _tokenId,
    parseEther(_tokenPrice)
  );
  return transaction;
}

export async function mint(
  _lodgeId: string,
  _tokenId: number,
  _value: number,
  _data: string,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const tokenPrice = (await tokenDetail(_tokenId)).tokenPricePerNight;
  const deposit = BigInt(parseEther(tokenPrice.toString())) * BigInt(_value);
  const transaction = await contract.mint(
    encodeBytes32String(_lodgeId),
    _tokenId,
    _value,
    toUtf8Bytes(_data),
    { value: deposit }
  );
  return transaction;
}

export async function withdrawFromCustomerCheckOut(
  _lodgeId: string,
  _orderId: string,
  _tokenId: number,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.withdrawFromCustomerCheckOut(
    encodeBytes32String(_lodgeId),
    encodeBytes32String(_orderId),
    _tokenId
  );
  return transaction;
}
