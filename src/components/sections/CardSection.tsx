// import React, { useEffect, useRef, useState } from "react";
// import { truncate } from "../../utils/helper";
// import { CardSpotlight } from "../ui/card-spotlight";
// import { toPng } from "html-to-image";

// interface CardSectionProps {
//   name: string;
//   image: string;
//   token_id: string;
//   price_per_night_in_eth: number;
//   accommodation_id: string;
//   accommodation_name: string;
//   description: string;
//   facilities: string[];
//   bedType: string;
//   maxPeople: number;
//   blockchain: string;
//   contract_address: string;
// }

// export const CardSection: React.FC<CardSectionProps> = ({
//   name,
//   image,
//   token_id,
//   price_per_night_in_eth,
//   accommodation_id,
//   accommodation_name,
//   description,
//   facilities,
//   bedType,
//   maxPeople,
//   blockchain,
//   contract_address,
// }) => {
// //   const cardRef = useRef<HTMLDivElement>(null);

// //   const saveCard = async () => {
// //     if (!cardRef.current) {
// //       console.error("Card reference not found!");
// //       return;
// //     }

// //     try {
// //       // Ambil screenshot elemen
// //       const imageUrl = await toPng(cardRef.current);

// //       // Debug log jika diperlukan
// //       console.log("Generated Image URL:", imageUrl);

// //       // Membuat elemen <a> untuk download
// //       const link = document.createElement("a");
// //       link.href = imageUrl;
// //       link.download = `${name}_card.png`; // Nama file
// //       link.click(); // Trigger download
// //     } catch (error) {
// //       console.error("Error generating card image:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       saveCard();
// //     }, 500); // Tunggu 500ms setelah render
// //     return () => clearTimeout(timer);
// //   }, []);

//   return (
//     <div
//     //   ref={cardRef}
//       className="fixed flex items-center justify-center w-screen h-screen inset-0 bg-black bg-opacity-50 p-4 z-50"
//     >
//       <div
//         data-aos="zoom-in-up"
//         data-aos-anchor-placement="top-bottom"
//         data-aos-duration="300"
//         className="h-fit w-full sm:w-9/12 lg:w-4/12 relative bg-black rounded-xl shadow-lg p-4"
//       >
//         {/* Close Button */}
//         <button
//           //   onClick={() => setIsModalOpen(false)}
//           type="button"
//           className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-almostBlack text-gray-500 hover:bg-gray-900 hover:text-gray-300 transition z-50"
//         >
//           <svg
//             className="h-4 w-4"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 14 14"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//             />
//           </svg>
//           <span className="sr-only">Close modal</span>
//         </button>
//         {/* Header */}
//         <div className="relative bg-gradient-to-r from-darkOrange to-primary rounded-lg p-2 flex items-center justify-center z-20">
//           <svg
//             className="w-6 h-6 text-white mr-2"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.89 12.7l-4.11-2 4.11-2 2-4.1 2 4.1 4.1 2-4.1 2-2 4.1z"></path>
//           </svg>
//           <span className="text-white font-bold text-lg">{name}</span>
//         </div>
//         {/* Image Section */}
//         <div className="mt-4">
//           <img
//             src={image}
//             alt={name}
//             className="relative w-full h-52 object-cover rounded-lg border border-primary z-20"
//           />
//         </div>
//         {/* Details Section */}
//         <div className="relative mt-4 bg-almostBlack p-3 rounded-lg border border-primary z-20">
//           <ul className="text-sm text-gray-300 space-y-2">
//             <li className="flex justify-between">
//               <span>Name</span>
//               <span className="text-yellow-400 font-semibold">{name}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Token Id</span>
//               <span>{token_id}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Price Per Night</span>
//               <span>{price_per_night_in_eth}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Accommodation Id</span>
//               <span>{accommodation_id}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Accommodation Name</span>
//               <span>{accommodation_name}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Description</span>
//               <span>{description}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Facilities</span>
//               <span>{facilities.join(", ")}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Bed Type</span>
//               <span>{bedType}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Max People</span>
//               <span>{maxPeople}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Blockchain</span>
//               <span>{blockchain}</span>
//             </li>
//             <hr className="border-t border-gray-300" />
//             <li className="flex justify-between">
//               <span>Contract Address</span>
//               <span>{truncate(contract_address, 10, 10, 24)}</span>
//             </li>
//           </ul>
//         </div>
//         {/* Footer */}
//         <div className="relative mt-4 flex justify-center items-center text-gray-400 z-20">
//           <img
//             src="/images/roomie_logo.jpg"
//             alt="Roomie Logo"
//             className="w-8 h-8 mr-2"
//           />
//           <span className="text-base font-semibold">Roomie</span>
//         </div>
//       </div>
//     </div>
//   );
// };
