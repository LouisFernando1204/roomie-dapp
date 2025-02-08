import { ShieldCheck, Gavel, Code, Eye, Users, Zap } from "lucide-react";

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
      "Hosts stay accountable by depositing ETH into a smart contract each time they mint an ERC-1155 NFT, ensuring only trusted accommodations.",
  },
  {
    icon: Gavel,
    header: "Decentralized Dispute Resolution",
    description:
      "Got an issue with your booking? Take it to our Court feature, where the community can vote transparently to resolve disputes fairly.",
  },
  {
    icon: Code,
    header: "Smart Contracts You Can Trust",
    description:
      "Our blockchain-backed system guarantees secure and transparent transactions, making every booking reliable and stress-free.",
  },
  {
    icon: Eye,
    header: "Transparent and Fraud-Free",
    description:
      "Roomie's escrow-based process keeps both guests and hosts accountable, ensuring a trusted platform for all users.",
  },
  {
    icon: Users,
    header: "Empowering the Community",
    description:
      "Our Court feature gives power to the community to resolve disputes, making the platform fair and inclusive for everyone.",
  },
  {
    icon: Zap,
    header: "Where Innovation Meets Safety",
    description:
      "Roomie blends cutting-edge Web3 technology with robust safety measures, ensuring a seamless and secure booking experience.",
  },
];
