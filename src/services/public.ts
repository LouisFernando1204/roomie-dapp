/* eslint-disable @typescript-eslint/no-explicit-any */
import { decodeBytes32String, encodeBytes32String, formatEther } from "ethers";
import { getContractWithoutSigner, getContractWithSigner } from "./connector";

export async function openCase(
  _caseId: string,
  _orderId: string,
  _lodgeId: string,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.openCase(
    encodeBytes32String(_caseId),
    encodeBytes32String(_orderId),
    encodeBytes32String(_lodgeId)
  );
  return transaction;
}

export async function voteOnCase(
  _caseId: string,
  _side: number,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.voteOnCase(
    encodeBytes32String(_caseId),
    _side
  );
  return transaction;
}

export async function withdrawForCaseWinner(
  _caseId: string,
  _orderId: string,
  _tokenId: number,
  _walletProvider: any
) {
  const contract = await getContractWithSigner(_walletProvider);
  const transaction = await contract.withdrawForCaseWinner(
    encodeBytes32String(_caseId),
    encodeBytes32String(_orderId),
    _tokenId
  );
  return transaction;
}

export async function uri(_tokenId: number) {
  const contract = await getContractWithoutSigner();
  const uri = await contract.uri(_tokenId);
  return uri;
}

export async function orderDetail(_orderId: string) {
  const contract = await getContractWithoutSigner();
  const orderDetail = await contract.orderDetail(encodeBytes32String(_orderId));
  return structuredOrderDetail(orderDetail);
}

export async function tokenDetail(_tokenId: number) {
  const contract = await getContractWithoutSigner();
  const tokenDetail = await contract.tokenDetail(_tokenId);
  return structuredTokenDetail(tokenDetail);
}

export async function caseDetail(_caseId: string) {
  const contract = await getContractWithoutSigner();
  const caseDetail = await contract.caseDetail(encodeBytes32String(_caseId));
  return structuredCaseDetail(caseDetail);
}

function structuredOrderDetail(_orderDetail: any) {
  const detail = {
    customerAddress: _orderDetail[0].toString(),
    accommodation: decodeBytes32String(_orderDetail[1]),
    orderToken: parseInt(_orderDetail[2]),
    checkInTimestamp: parseInt(_orderDetail[3]),
    checkOutTimestamp: parseInt(_orderDetail[4]),
    customerStayDuration: parseInt(_orderDetail[5]),
    customerAlreadyCheckIn: Boolean(_orderDetail[6]),
    customerAlreadyCheckOut: Boolean(_orderDetail[7]),
  };
  return detail;
}

function structuredTokenDetail(_tokenDetail: any) {
  const detail = {
    lodgeToken: decodeBytes32String(_tokenDetail[0]),
    tokenPricePerNight: formatEther(_tokenDetail[1]),
    tokenSupply: parseInt(_tokenDetail[2]),
    tokenBurn: parseInt(_tokenDetail[3]),
  };
  return detail;
}

function structuredCaseDetail(_caseDetail: any) {
  const detail = {
    problematicOrder: _caseDetail[0],
    totalHostVote: parseInt(_caseDetail[1]),
    totalCustomerVote: parseInt(_caseDetail[2]),
    caseCreatedTimestamp: parseInt(_caseDetail[3]),
  };
  return detail;
}
