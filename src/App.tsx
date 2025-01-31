import { createAppKit, useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, holesky } from "@reown/appkit/networks";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";

import Home from "./views/Home"
import RoomList from "./views/RoomListView"
import OrderList from "./views/OrderListView"
import History from "./views/History"

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

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => { }, [isUser, isConnected]);

  return (
    <div className="mx-12 font-lato">
      <Navbar
        connectedAddress={address}
        setIsUser={setIsUser}
        isUser={isUser}
        handleConnect={open}
      />

      {/* Sesuaikan nama / path dgn yang di utils/list.ts */}
      <div className="mt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<RoomList />} />
          <Route path="/order" element={<OrderList />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
      <Footer isUser={isUser} setIsUser={setIsUser} />
    </div>
  );
}

export default App;
