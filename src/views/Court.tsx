/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accommodation } from "../model/accommodation";
import { normalModal, successModal } from "../utils/helper";
import {
  createUserCase
} from "../server/case";
import { pinata } from "../global/global";
import 'animate.css';
import Swal from 'sweetalert2'

interface CourtProps {
  accommodation: Accommodation | undefined;
  address: string | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Court: React.FC<CourtProps> = ({
  accommodation,
  address,
  loading,
  setLoading
}) => {

  const [bookingId, setBookingId] = useState("");
  const [caseName, setCaseName] = useState("");
  const [argument, setArgument] = useState("");
  const [evidence, setEvidence] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEvidence(imageUrl);
    }
  };

  const checkCaseInput = () => {
    if (
      bookingId == "" ||
      caseName == "" ||
      argument == "" ||
      evidence.length == 0
    ) {
      normalModal(
        "error",
        "Oops..",
        "Something’s missing or incorrect. Let’s make it perfect—double-check your input!"
      );
      return false;
    }
    return true;
  };

  // const lodgeNewUserCase = async () => {
  //     setLoading(true);
  //     const success = checkCaseInput();
  //     if (success) {
  //       try {
  //         const { evidenceImageUrl } = await uploadImageToPinata();
  //         const res = await createUserCase(
  //           address!,
  //           argument,
  //           evidence,
  //           bookingId,
  //           caseName
  //         );
  //           if (res!.status == 201) {
  //             const tx = await registerToken(
  //               accommodation!.id,
  //               tokenUri,
  //               parseInt(tokenId),
  //               tokenPrice,
  //               walletProvider
  //             );
  //             const receipt = await tx.wait();
  //             if (receipt) {
  //               setShowModal(false);
  //               setUpdate(!update);
  //               if (!loading) {
  //                 setTimeout(() => {
  //                   successModal("Created Successfully!", tx.hash);
  //                 }, 2500);
  //               }
  //             } else {
  //               errorScenario();
  //             }
  //           } else {
  //             errorScenario();
  //           }
  //       } catch (error) {
  //         console.log(error);
  //         errorScenario()
  //       }
  //     }
  //   };

  const errorScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while register your accommodation. Please try again later!"
        );
      }, 1000);
    }
  };

  const uploadImageToPinata = async () => {
    try {
      const evidenceImageUpload = await pinata.upload.url(evidence);
      const hashedEvidenceImageUrl = `https://gateway.pinata.cloud/ipfs/${evidenceImageUpload.IpfsHash}`;
      return { evidenceImageUrl: hashedEvidenceImageUrl };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleVote = async () => {
    const result = await Swal.fire({
      html: `
        <div style="text-align: center;">
          <p>Are you sure you want to vote on this case?</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Vote',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-modal',
        confirmButton: 'swal-confirm-button swal-wide-button',
        cancelButton: 'swal-cancel-button swal-wide-button',
        actions: 'swal-two-buttons'
      },
      buttonsStyling: false
    });

    if (result.isDismissed) {
      console.log("Cancel vote.");
    } else {
      console.log("Confirm vote.");
      // console.log(response['vaultid']);
      // setIsLoading(true);
      // await addVerifiedUser(response['vaultid']);
      // setIsLoading(false);
      // navigate('/auction');
    }
  };

  useEffect(() => {
    const modal = document.getElementById("case-modal");
    const overlay = document.getElementById("modal-overlay");
    const openBtn = document.querySelector("[data-modal-toggle='open-case-modal']");
    const closeBtn = modal?.querySelector("[data-modal-toggle='close-case-modal']");

    const openModal = () => {
      modal?.classList.remove("hidden", "animate__bounceOut");
      modal?.classList.add("animate__animated", "animate__bounceIn");
      overlay?.classList.remove("hidden");
    };

    const closeModal = () => {
      modal?.classList.remove("animate__bounceIn");
      modal?.classList.add("animate__animated", "animate__bounceOut");
      overlay?.classList.add("hidden");

      modal?.addEventListener("animationend", function handleAnimationEnd() {
        modal?.classList.add("hidden");
        modal?.removeEventListener("animationend", handleAnimationEnd);
      }, { once: true });
    };

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    return () => {
      if (openBtn) openBtn.removeEventListener("click", openModal);
      if (closeBtn) closeBtn.removeEventListener("click", closeModal);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mb-16">
      <div className="w-5/6 h-full flex flex-col justify-center items-center space-y-6">
        <div className="w-full md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="shrink-0 text-xl font-semibold text-darkOrange sm:text-2xl">Accommodation Cases</h2>
          <button
            onClick={
              () => {
                // if (accommodation != null) {
                //   handleCreateAccommodationCase();
                // } else {
                //   handleCreateUserCase();
                // }
              }
            }
            type="button" data-modal-target="case-modal" data-modal-toggle="open-case-modal" className="mt-4 w-full shrink-0 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-darkYellow focus:outline-none sm:mt-0 md:w-auto">Lodge a case</button>
        </div>
        <div className="bg-white antialiased rounded-lg drop-shadow-xl w-full">
          <div className="p-4">
            <div className="space-y-2 flex flex-col">
              <div className="grid gap-2">
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 md:mb-0">caseStatus</span>
                  <button
                    onClick={
                      () => {
                        handleVote();
                      }
                    }
                    type="button" className="text-white bg-primary hover:bg-darkYellow focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center me-2 mb-2">
                    <svg className="w-4 h-4 me-2 -ms-1 text-sm text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                    </svg>
                    Vote now
                  </button>
                </div>
                <span className="text-xl font-semibold text-gray-900">caseName</span>
              </div>
              <span className="text-base font-normal text-gray-500">Booking Id: bookingId</span>
              <span className="text-base font-normal text-gray-500">Voted by: 12 people</span>
              <span className="text-base font-normal text-gray-500">Created at: createdAt</span>
            </div>
            <Link to={`/court/${null}`}>
              <button type="button" className="mt-6 w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none">View details</button>
            </Link>
          </div>
        </div>
      </div>
      <div
        id="modal-overlay"
        className="fixed inset-0 top-0 left-0 right-0 bg-black bg-opacity-50 hidden z-40 w-full h-screen"
      ></div>
      <div id="case-modal" tabIndex={-1} aria-hidden="true" className="fixed hidden top-0 left-0 right-0 z-50 w-full h-screen items-center justify-center overflow-y-auto overflow-x-hidden antialiased ">
        <div className="relative h-screen w-full p-4 flex justify-center items-center">
          <div className="relative rounded-lg w-full sm:w-3/4 lg:w-5/12 bg-white shadow">
            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900">Lodge New Case</h3>
              <button type="button" className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900" data-modal-toggle="close-case-modal">
                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="caseName" className="mb-2 block text-sm font-medium text-gray-900">Case Name</label>
                  <input id="caseName" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"></input>
                </div>
                <div className="col-span-2">
                  <label htmlFor="caseArgument" className="mb-2 block text-sm font-medium text-gray-900">Argument</label>
                  <input id="caseArgument" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"></input>
                </div>
                <div className="col-span-2">
                  <p className="mb-2 block text-sm font-medium text-gray-900">Upload Evidence</p>
                  <div className="flex w-full items-center justify-center">
                    <label htmlFor="caseEvidence" className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <svg className="mb-4 h-8 w-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                      </div>
                      <input id="caseEvidence" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 md:pt-5">
                <button type="submit" className="me-2 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-darkYellow focus:outline-none">Submit case</button>
                <button type="button" data-modal-toggle="close-case-modal" className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Court;