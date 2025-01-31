import { createAppKit, useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, holesky } from "@reown/appkit/networks";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { LodgeProfile } from "./views/LodgeProfile";
import { PinataSDK } from "pinata-web3"
import Token from "./views/Token";

const projectId = import.meta.env.VITE_PROJECT_ID;

const networks: [AppKitNetwork] = [holesky];

const metadata = {
  name: "Roomie",
  description:
    "Roomie is a cutting-edge Web 3.0 platform built on the Manta Pacific ecosystem, revolutionizing the way accommodations are rented.",
  url: "http://127.0.0.1:5173",
  icons: ["https://avatars.roomie.com/"],
};

export const pinata = new PinataSDK({
  pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
  pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`
})

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
});

function App() {
  const [isUser, setIsUser] = useState(true);

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {}, [isUser, isConnected]);

  return (
    <div className="lg:mx-12 font-poppins">
      <Navbar
        connectedAddress={address}
        setIsUser={setIsUser}
        isUser={isUser}
        handleConnect={open}
      />
      <Routes>
        <Route path="/lodge_profile" element={<LodgeProfile connectedAccount={address} />} />
        <Route path="/token" element={<Token />} />
      </Routes>
      <Footer isUser={isUser} setIsUser={setIsUser} />
    </div>
  );
}

export default App;
