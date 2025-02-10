import { ShieldCheck, Bot, Eye, LockKeyhole, Zap, Vote } from "lucide-react";

export const userNavList = [
  { title: "Home", url: "/" },
  { title: "History", url: "/history" },
  { title: "Court", url: "/court" },
];

export const adminNavList = [
  { title: "Room", url: "/room" },
  { title: "Order", url: "/order" },
  { title: "Court", url: "/court" },
  { title: "Accommodation Profile", url: "/accommodation_profile" },
];

export const roomieAdvantage = [
  {
    icon: ShieldCheck,
    header: "Safety First: No More Scams",
    description:
      "Hosts must deposit ETH into a smart contract when minting ERC-1155 NFTs to ensure trusted accommodations.",
  },
  {
    icon: Vote,
    header: "Decentralized Dispute Resolution",
    description:
      "Got an issue about your booking? Use our Court feature for fair, transparent community voting to resolve disputes.",
  },
  {
    icon: Bot,
    header: "Your 24/7 Friendly AI Buddy",
    description:
    "Roomie's AI chatbot helps you find the perfect room for your preference anytime. Get instant recommendations and personalized assistance effortlessly.",
  },    
  {
    icon: Eye,
    header: "Transparent and Fraud-Free",
    description:
      "Roomie's escrow-based process keeps both guests and hosts accountable, ensuring a trusted platform for all users.",
  },
  {
    icon: LockKeyhole,
    header: "Smart Contracts You Can Trust",
    description:
      "Our blockchain-backed system guarantees secure and transparent transactions, making every booking reliable and stress-free.",
  },
  {
    icon: Zap,
    header: "Where Innovation Meets Safety",
    description:
      "Roomie combines Web3 technology with robust safety measures for a secure booking experience. Enjoy seamless transactions with transparency and trust.",
  }  
];
