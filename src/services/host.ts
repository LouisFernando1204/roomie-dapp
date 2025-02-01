import { getContractWithSigner } from "./connector";

export async function registerLodge(_lodgeId: string) {
  const contract = await getContractWithSigner();
  const transaction = await contract.registerLodge(_lodgeId);
  return transaction;
}

export async function registerToken(
  _lodgeId: string,
  _tokenURI: string,
  _tokenId: number,
  _tokenPrice: number
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.registerToken(_lodgeId, _tokenURI, _tokenId, _tokenPrice);
  return transaction;
}

export async function mint(
  _lodgeId: string,
  _tokenId: number,
  _value: number,
  _data: string
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.mint(_lodgeId, _tokenId, _value, "");
  return transaction;
}

export async function checkOut(
  _lodgeId: string,
  _orderId: string,
  _tokenId: number
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.checkOut(_lodgeId, _orderId, _tokenId);
  return transaction;
}
