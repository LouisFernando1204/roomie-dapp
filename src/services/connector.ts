import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import contractAbi from "../abi/contractAbi.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const networkRPC = import.meta.env.VITE_NETWORK_RPC;

// change to :
// const { walletProvider } = useAppKitProvider('eip155')
// const provider = new ethers.BrowserProvider((walletProvider) as any);

export async function getContractWithSigner() {
  const provider = new BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(contractAddress, contractAbi, signer);
  return contract;
}

export async function getContractWithoutSigner() {
  const provider = new JsonRpcProvider(networkRPC);
  const contract = new Contract(contractAddress, contractAbi, provider);
  return contract;
}
