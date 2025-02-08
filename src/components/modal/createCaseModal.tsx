/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { normalModal, successModal } from "../../utils/helper";
import { pinata } from "../../global/global";
import { Accommodation } from "../../model/accommodation";
import {
  createUserCase,
  createAccommodationCase,
  deleteCase,
} from "../../server/case";
import { openCase } from "../../services/public";

interface CreateCaseModalProps {
  setShowCaseModal: React.Dispatch<React.SetStateAction<boolean>>;
  accommodation: Accommodation | undefined;
  address: string | undefined;
  bookingId: string | undefined;
  accommodationId: string | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  walletProvider: any;
  oldCaseName: string | undefined;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  setShowCaseModal,
  accommodation,
  address,
  bookingId,
  accommodationId,
  loading,
  setLoading,
  walletProvider,
  oldCaseName,
}) => {
  const [caseName, setCaseName] = useState("");
  const [caseArgument, setCaseArgument] = useState("");
  const [caseEvidence, setCaseEvidence] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCaseEvidence(imageUrl);
    }
  };

  const checkCaseInput = () => {
    if (caseName == "" || caseArgument == "" || caseEvidence.length == 0) {
      normalModal(
        "error",
        "Oops..",
        "Something’s missing or incorrect. Let’s make it perfect—double-check your input!"
      );
      return false;
    }
    return true;
  };

  const lodgeNewUserCase = async () => {
    setLoading(true);
    const success = checkCaseInput();
    if (success) {
      try {
        const { evidenceImageUrl } = await uploadImageToPinata();
        const res = await createUserCase(
          address!,
          caseArgument,
          evidenceImageUrl,
          bookingId!,
          caseName
        );
        if (res?.status === 201) {
          try {
            const tx = await openCase(
              res.data.caseData._id,
              bookingId!,
              accommodationId!,
              walletProvider
            );
            if (tx) {
              setLoading(false);
              successModal("Created Successfully!", tx.hash);
            } else {
              await deleteCase(res.data.caseData._id);
              setLoading(false);
              errorScenario();
            }
          } catch (error) {
            console.log(error);
            await deleteCase(res.data.caseData._id);
            setLoading(false);
            errorScenario();
          }
        } else {
          setLoading(false);
          errorScenario();
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        errorScenario();
      } finally {
        setLoading(false);
        setShowCaseModal(false);
      }
    } else {
      setLoading(false);
      errorScenario();
    }
  };

  const lodgeNewAccommodationCase = async () => {
    setLoading(true);
    const success = checkCaseInput();
    if (success) {
      try {
        const { evidenceImageUrl } = await uploadImageToPinata();
        const res = await createAccommodationCase(
          accommodation!.id,
          caseArgument,
          evidenceImageUrl,
          bookingId!,
          caseName
        );
        if (res!.status == 201) {
          try {
            const tx = await openCase(
              res!.data.caseData._id,
              bookingId!,
              accommodationId!,
              walletProvider
            );
            if (tx) {
              setLoading(false);
              successModal("Created Successfully!", tx.hash);
            } else {
              await deleteCase(res!.data.caseData._id);
              setLoading(false);
              errorScenario();
            }
          } catch (error) {
            console.log(error);
            await deleteCase(res!.data.caseData._id);
            setLoading(false);
            errorScenario();
          }
        } else {
          setLoading(false);
          errorScenario();
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        errorScenario();
      } finally {
        setLoading(false);
        setShowCaseModal(false);
      }
    } else {
      setLoading(false);
      errorScenario();
    }
  };

  const errorScenario = () => {
    setLoading(false);
    if (!loading) {
      setTimeout(() => {
        normalModal(
          "error",
          "Oops...",
          "Error while lodging a case. Please try again later!"
        );
      }, 1000);
    }
  };

  const uploadImageToPinata = async () => {
    try {
      const evidenceImageUpload = await pinata.upload.url(caseEvidence);
      const hashedEvidenceImageUrl = `https://gateway.pinata.cloud/ipfs/${evidenceImageUpload.IpfsHash}`;
      return { evidenceImageUrl: hashedEvidenceImageUrl };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <>
      <div
        className={`fixed flex items-center justify-center w-screen h-screen inset-0 bg-black bg-opacity-50 z-50`}
      >
        <div
          data-aos="zoom-in-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-duration="300"
          className="relative h-screen w-full p-4 flex justify-center items-center"
        >
          <div className="relative rounded-lg w-full sm:w-3/4 lg:w-5/12 bg-white shadow">
            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Lodge New Case
              </h3>
              <button
                onClick={() => {
                  setShowCaseModal(false);
                }}
                type="button"
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    htmlFor="caseName"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Case Name
                  </label>
                  <input
                    id="caseName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
                    placeholder="E.g., Complaint about false advertisement"
                    onChange={(e) => setCaseName(e.target.value)}
                    value={oldCaseName ? oldCaseName : caseName}
                  ></input>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="caseArgument"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Argument
                  </label>
                  <input
                    id="caseArgument"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
                    placeholder="E.g., The facilities do not match the advertisement"
                    onChange={(e) => setCaseArgument(e.target.value)}
                  ></input>
                </div>
                <div className="col-span-2">
                  <p className="mb-2 block text-sm font-medium text-gray-900">
                    Upload Evidence
                  </p>
                  <div className="flex w-full items-center justify-center">
                    <label
                      htmlFor="caseEvidence"
                      className="flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      {caseEvidence ? (
                        <img
                          src={caseEvidence}
                          alt="Preview"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <svg
                            className="mb-4 h-8 w-8 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG
                          </p>
                        </div>
                      )}
                      <input
                        id="caseEvidence"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 md:pt-5">
                <button
                  type="button"
                  className="me-2 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-darkYellow focus:outline-none"
                  onClick={() => {
                    if (accommodation != null) {
                      lodgeNewAccommodationCase();
                    } else {
                      lodgeNewUserCase();
                    }
                  }}
                >
                  Submit case
                </button>
                <button
                  onClick={() => {
                    setShowCaseModal(false);
                  }}
                  type="button"
                  className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
