import { getContractWithoutSigner } from "./connector";

export async function uri(_tokenId: number) {
  const contract = await getContractWithoutSigner();
  const uri = await contract.uri(_tokenId);
  return uri;
}

export async function balanceOf(_account: string, _tokenId: number) {
  const contract = await getContractWithoutSigner();
  const balance = await contract.balanceOf(_account, _tokenId);
  return parseInt(balance);
}

export async function orderDetail(_orderId: string) {
  const contract = await getContractWithoutSigner();
  const orderDetail = await contract.orderDetail();
  return structuredOrderDetail(orderDetail);
}

export async function tokenDetail(_tokenId: number) {
  const contract = await getContractWithoutSigner();
  const tokenDetail = await contract.tokenDetail(_tokenId);
  return structuredTokenDetail(tokenDetail);
}

export async function lodgeHost(_lodgeId: string) {
  const contract = await getContractWithoutSigner();
  const lodgeHost = await contract.lodgeHost();
  return lodgeHost.toString();
}

function structuredOrderDetail(_orderDetail: any) {
  const detail = {
    customerAddress: _orderDetail[0],
    checkInTimestamp: _orderDetail[1],
    checkOutTimestamp: _orderDetail[2],
    customerStayDuration: _orderDetail[3],
    customerAlreadyCheckIn: _orderDetail[4],
  };
  return detail;
}

function structuredTokenDetail(_tokenDetail: any) {
  const detail = {
    lodgeToken: _tokenDetail[0],
    tokenPricePerNight: _tokenDetail[1],
  };
  return detail;
}
