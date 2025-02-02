// import { useState } from "react";
// import { CreateTokenModal } from "../components/modal/CreateRoomModal";

// export const dummyToken = [
//   {
//     id: 100,
//     price: 0.001,
//     mint: 1000,
//     burn: 90,
//   },
//   {
//     id: 101,
//     price: 0.002,
//     mint: 90,
//     burn: 8,
//   },
//   {
//     id: 102,
//     price: 0.01,
//     mint: 100,
//     burn: 90,
//   },
// ];

// export const tokenAttributes = [
//   "Number",
//   "Token ID",
//   "Price (ETH)",
//   "Total Mint",
//   "Total Burn",
//   "Action",
// ];

// export default function Token() {
//   const [showModal, setShowModal] = useState(false);
//   const [newTokenId, setNewTokenId] = useState("");
//   const [newTokenURI, setNewTokenURI] = useState("");
//   const [newTokenPrice, setNewTokenPrice] = useState("");

//   const tdStyling = "py-2 border border-gray-200";
//   const thStyling = "first:rounded-tl-xl last:rounded-tr-xl py-2";

//     const submit = () => {
//       console.log("aa")
//     setShowModal(false);
//     };
    
//   return (
//     <div className="w-full sm:min-h-[66vh] lg:min-h-[70vh] text-secondary font-semibold text-lg px-8">
//       <button
//         onClick={() => setShowModal(true)}
//         className="p-3 bg-primary rounded-xl duration-200 hover:scale-105 shadow-md"
//       >
//         Create Token
//       </button>
//       <div className="mt-12 overflow-x-auto shadow-sm">
//         <table className="w-full table-fixed rounded-xl">
//           <thead className="bg-primary">
//             <tr className="">
//               {tokenAttributes.map((attr, _) => (
//                 <th className={`${thStyling}`}>{attr}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="text-black font-normal text-center">
//             {dummyToken.map((item, number) => (
//               <tr className="my-2" key={item.id}>
//                 <td className={tdStyling}>{number + 1}</td>
//                 <td className={tdStyling}>{item.id}</td>
//                 <td className={tdStyling}>{item.price}</td>
//                 <td className={tdStyling}>{item.mint}</td>
//                 <td className={tdStyling}>{item.burn}</td>
//                 <td className={tdStyling}>
//                   <button className="bg-primary shadow-md py-2 px-8 rounded-lg hover:scale-105 duration-200 text-secondary font-semibold">
//                     Mint
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {showModal && (
//         <CreateTokenModal
//           setShowModal={setShowModal}
//           setNewTokenId={setNewTokenId}
//           setNewTokenPrice={setNewTokenPrice}
//           setNewTokenURI={setNewTokenURI}
//           submit={submit}
//         />
//       )}
//     </div>
//   );
// }
