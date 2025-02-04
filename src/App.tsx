import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, holesky } from "@reown/appkit/networks";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { LodgeProfile } from "./views/LodgeProfile";
import Court from "./views/Court";
import CourtDetail from "./views/CourtDetail";

import Home from "./views/Home";
import RoomList from "./views/RoomListView";
import OrderList from "./views/OrderListView";

import "flowbite";
import { getAccommodations } from "./server/accommodation";
import { Accommodation } from "./model/accommodation";
import { LoadingScreen } from "./components/ui/loading-screen";
import HistoryPage from "./views/History";

const projectId = import.meta.env.VITE_PROJECT_ID;

const networks: [AppKitNetwork] = [holesky];

const metadata = {
  name: "Roomie",
  description:
    "Roomie is a cutting-edge Web 3.0 platform built on the Manta Pacific ecosystem, revolutionizing the way accommodations are rented.",
  url: "http://127.0.0.1:5173",
  icons: ["https://avatars.roomie.com/"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
});

function App() {
  const [isUser, setIsUser] = useState(true);
  const [accommodation, setAccommodation] = useState<Accommodation>();
  const [loading, setLoading] = useState(true)
  const [lodgeUpdate, setLodgeUpdate] = useState(false)

  const navigate = useNavigate();

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  useEffect(() => {
    if (isUser) {
      navigate("/");
    } else {
      navigate("/room");
    }
  }, [isUser, isConnected]);

  useEffect(() => {
    fetchAccomodations()
  }, [lodgeUpdate, isConnected])

  const fetchAccomodations = async () => {
    setLoading(true)
    try {
      const res = await getAccommodations();
      if (res) {
        const accommodation = res.find(
          (item: Accommodation) => item.accommodationHost === address
        );
        setAccommodation(accommodation);
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log(accommodation);
  }, [accommodation]);


  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="font-lato bg-amber-100 min-h-screen flex flex-col">
      <Navbar
        connectedAddress={address}
        setIsUser={setIsUser}
        isUser={isUser}
        handleConnect={open}
      />

      <div className="flex-1 mt-32 px-4 md:px-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/room"
            element={<RoomList walletProvider={walletProvider} accommodation={accommodation} isConnected={ isConnected } />}
          />
          <Route path="/order" element={<OrderList />} />
          <Route
            path="/lodge_profile"
            element={
              <LodgeProfile
                connectedAccount={address}
                isConnected={isConnected}
                walletProvider={walletProvider}
                accommodation={accommodation}
                setLodgeUpdate={setLodgeUpdate}
                lodgeUpdate={lodgeUpdate}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
          <Route path="/history" element={ <HistoryPage walletProvider={walletProvider} address={address} /> } />
          <Route path="/court" element={<Court accommodation={accommodation} address={address} loading={loading}
                setLoading={setLoading} />} />
          <Route path="/court/:id" element={<CourtDetail />} />
        </Routes>
      </div>
      <Footer isUser={isUser} setIsUser={setIsUser} />
    </div>
  );
}

export default App;
