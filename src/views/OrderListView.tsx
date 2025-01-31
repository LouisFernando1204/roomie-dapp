"use client";
import React, { useEffect, useState, Suspense } from "react";

const OrderList = () => {
  const [errorMessage, setErrorMessage] = useState(null); // Define errorMessage to avoid undefined error

  const dummyData = {
    ICP_UserBalance: 100,
    propertyAuctionCards: [
      { address: "Bikini Bottom No. 42, Los Angeles", propertyType: "House", startingBid: 5, startBid_Date: "2024-05-05", endBit_Date: "2024-05-19", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/380dbd01-38ee-4146-93df-31ce051f4b83/dfodfos-503fd0f7-8823-4c7d-ab84-753ed00e5e93.png/v1/fill/w_847,h_943,q_70,strp/_sbsp__the_chum_bucket_by_spongedrew250_dfodfos-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM4MGRiZDAxLTM4ZWUtNDE0Ni05M2RmLTMxY2UwNTFmNGI4M1wvZGZvZGZvcy01MDNmZDBmNy04ODIzLTRjN2QtYWI4NC03NTNlZDAwZTVlOTMucG5nIiwiaGVpZ2h0IjoiPD0yMTM2Iiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvMzgwZGJkMDEtMzhlZS00MTQ2LTkzZGYtMzFjZTA1MWY0YjgzXC9zcG9uZ2VkcmV3MjUwLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.qGf1PFS1m4MBgmH9wnHwcHWB0mKU9dKMLCZxEzkRw5c", area: 240 },
      { address: "International House II, 45 Jurye-ro", propertyType: "Student Dormitory", startingBid: 25, startBid_Date: "2024-05-8", endBit_Date: "2024-05-22", image: "https://i.namu.wiki/i/qW2jMif6OYol0suRznfNCRWwxxoPJkfz26RP2CFBytbiDxXfXzVljtawQnSUfSVAvbUjiRW6hKWvASvIR7QPRg.webp", area: 2000 },
      { address: "Jl. HR Muhammad No. 25, Pradahkalikendal", propertyType: "Surga Dunia", startingBid: 200, startBid_Date: "2024-10-16", endBit_Date: "2024-10-30", image: "https://imgcdn.espos.id/@espos/images/2022/10/gacoan.jpg", area: 1250 },
      { address: "Jl. Gajahmada No.107, Miroto, Semarang", propertyType: "Restaurant", startingBid: 175, startBid_Date: "2024-05-8", endBit_Date: "2024-05-22", image: "https://indonesiatraveler.id/wp-content/uploads/2020/03/Lunpia-Cik-Me-Me3.jpg", area: 1089 },
    ],
  };

  return (
    <div>
        

               
    </div>
  );
};

export default OrderList