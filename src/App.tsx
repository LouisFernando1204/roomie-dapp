import { createAppKit, useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, holesky } from "@reown/appkit/networks";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { LodgeProfile } from "./views/LodgeProfile";
import { PinataSDK } from "pinata-web3"
import Token from "./views/Token";
import { Court } from "./views/Court";

import Home from "./views/Home"
import RoomList from "./views/RoomListView"
import OrderList from "./views/OrderListView"

import "flowbite";

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
  const navigate = useNavigate();

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isUser) {
      navigate("/")
    }
    else {
      navigate("/room")
    }
  }, [isUser, isConnected]);

  return (
    <div className="px-4 md:px-12 font-lato bg-amber-100 min-h-screen flex flex-col">
      <Navbar
        connectedAddress={address}
        setIsUser={setIsUser}
        isUser={isUser}
        handleConnect={open}
      />

      <div className="flex-1 mt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<RoomList />} />
            <Route path="/order" element={<OrderList />} />
            <Route path="/lodge_profile" element={<LodgeProfile connectedAccount={address} />} />
        <Route path="/token" element={<Token />} />
        <Route path="/court" element={ <Court /> } />
        </Routes>
      </div>
      <Footer isUser={isUser} setIsUser={setIsUser} />
    </div>
  );
}

export default App;
