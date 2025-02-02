import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";

interface BookingHistoryItem {
  orderId: string;
  lodgeId: string;
  userAccount: string;
  tokenId: string;
  checkIn: number;
  checkOut: number;
  checkedIn: boolean;
  nftImage: string;
}

const fetchHistoryData = async (): Promise<BookingHistoryItem[]> => {
  // Replace with actual API call
  return [
    {
      orderId: "12345",
      lodgeId: "67890",
      userAccount: "0x237128as987d23f...",
      tokenId: "54321",
      checkIn: 1704067200,
      checkOut: 1704153600,
      checkedIn: false,
      nftImage: "https://via.placeholder.com/150",
    },
    {
      orderId: "54321",
      lodgeId: "09876",
      userAccount: "0x98f7123ba7638ff...",
      tokenId: "67890",
      checkIn: 1704153600,
      checkOut: 1704240000,
      checkedIn: false,
      nftImage: "https://via.placeholder.com/150",
    },
  ];
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<BookingHistoryItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<{ tokenId: string; image: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDate = Math.floor(Date.now() / 1000);

  useEffect(() => {
    fetchHistoryData().then(setHistory);
  }, []);

  const handleCheckIn = (orderId: string) => {
    setHistory((prevHistory) =>
      prevHistory.map((item) =>
        item.orderId === orderId && item.checkIn <= currentDate && !item.checkedIn
          ? { ...item, checkedIn: true }
          : item
      )
    );
  };

  return (
    <div className="p-6 bg-lightGray min-h-screen font-poppins">
      <h1 className="text-2xl font-bold text-almostBlack mb-4">Booking History</h1>
      <div className="space-y-4">
        {history.map((item) => (
          <motion.div
            key={item.orderId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 shadow-lg rounded-2xl bg-white flex justify-between items-center border-2 border-brightYellow">
              <CardContent>
                <p className="text-almostBlack font-semibold">Order ID: {item.orderId}</p>
                <p className="text-sm text-gray-500">Lodge ID: {item.lodgeId}</p>
                <p className="text-sm text-gray-500">User: {item.userAccount}</p>
                <p className="text-primary font-bold">Token ID: {item.tokenId}</p>
                <p className="text-sm text-gray-500">
                  Check-in: {format(new Date(item.checkIn * 1000), "PPpp")}
                </p>
                <p className="text-sm text-gray-500">
                  Check-out: {format(new Date(item.checkOut * 1000), "PPpp")}
                </p>
              </CardContent>
              <div className="flex space-x-2">
                {item.checkIn <= currentDate && !item.checkedIn && (
                  <Button
                    onClick={() => handleCheckIn(item.orderId)}
                    className="bg-primary text-white flex items-center"
                  >
                    <CheckCircle size={16} className="mr-1" /> Check-in
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSelectedNFT({ tokenId: item.tokenId, image: item.nftImage });
                    setIsModalOpen(true);
                  }}
                  className="bg-complementary text-white flex items-center"
                >
                  <Eye size={16} className="mr-1" /> Show NFT
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* NFT Modal */}
      {isModalOpen && selectedNFT && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">NFT Details</h2>
              <p>Token ID: {selectedNFT.tokenId}</p>
              <img src={selectedNFT.image} alt="NFT" className="w-64 h-64 object-cover mt-2 rounded-lg" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-darkOrange text-secondary px-4 py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default HistoryPage;
