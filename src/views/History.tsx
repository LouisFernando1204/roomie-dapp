import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Eye } from "lucide-react";

interface HistoryItem {
  id: number;
  location: string;
  date: string;
  price: string;
  type: string;
  checkInAvailable: boolean;
}

const HistoryPage: React.FC = () => {
  const historyData: HistoryItem[] = [
    {
      id: 1,
      location: "Gloria Pakuwon City Christian School to Apartemen",
      date: "25 Jan 2025, 12:14 PM",
      price: "Rp19.500",
      type: "car",
      checkInAvailable: true,
    },
    {
      id: 2,
      location: "Apartemen Puncak Dharmahusada Kalijudan to ...",
      date: "9 Dec 2024, 6:11 AM",
      price: "Rp8.000",
      type: "bike",
      checkInAvailable: false,
    },
  ];

  return (
    <div className="p-6 bg-lightGray min-h-screen font-poppins">
      <h1 className="text-2xl font-bold text-almostBlack mb-4">Activity History</h1>
      <div className="space-y-4">
        {historyData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 shadow-lg rounded-2xl bg-white flex justify-between items-center">
              <CardContent>
                <p className="text-almostBlack font-semibold">{item.location}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="text-primary font-bold">{item.price}</p>
              </CardContent>
              <div className="flex space-x-2">
                {item.checkInAvailable && (
                  <Button className="bg-primary text-white flex items-center">
                    <CheckCircle size={16} className="mr-1" /> Check-in
                  </Button>
                )}
                <Button className="bg-complementary text-white flex items-center">
                  <Eye size={16} className="mr-1" /> Show NFT
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
