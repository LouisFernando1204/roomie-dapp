import { getContractWithSigner } from "./connector";

export async function registerLodge(_lodgeId: string) {
  const contract = await getContractWithSigner();
  const transaction = await contract.registerLodge();
}

export async function registerToken(
  _lodgeId: string,
  _tokenURI: string,
  _tokenId: number,
  _tokenPrice: number
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.registerToken();
}

export async function mint(
  _lodgeId: string,
  _tokenId: number,
  _value: number,
  _data: string
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.mint();
}

export async function checkOut(
  _lodgeId: string,
  _orderId: string,
  _tokenId: number
) {
  const contract = await getContractWithSigner();
  const transaction = await contract.checkOut();
}
