/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { normalModal, successModal } from "../utils/helper";
import { Case } from "../model/case";
import { getCaseById } from "../server/case";
import { caseDetail, voteOnCase } from "../services/public";
import { format } from "date-fns";
import { LoadingScreen } from "../components/ui/loading-screen";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

interface CourtDetailProps {
    walletProvider: any;
}

const CourtDetail: React.FC<CourtDetailProps> = ({
    walletProvider
}) => {

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [courtCase, setCourtCase] = useState<Case>();

    useEffect(() => {
        const fetchSpecificCase = async () => {
            setLoading(true);
            try {
                const res = await getCaseById(id!);
                if (res) {
                    const caseDetailData = await caseDetail(
                        res.id
                    );
                    const structuredCourtCase = {
                        ...res,
                        totalCustomerVote: caseDetailData.totalCustomerVote,
                        totalAccommodationVote: caseDetailData.totalHostVote
                    };
                    setLoading(false);
                    setCourtCase(structuredCourtCase);
                } else {
                    setLoading(false);
                    errorScenario("get specific case");
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
                errorScenario("get specific case");
            } finally {
                setLoading(false);
            }
        };
        fetchSpecificCase();
    }, [id, update]);

    const voteCase = async (caseId: string, side: number) => {
        setLoading(true);
        try {
            const tx = await voteOnCase(
                caseId,
                side,
                walletProvider
            );
            const receipt = await tx.wait();
            if (receipt) {
                setUpdate(!update);
                successModal("Voted Successfully!", tx.hash);
            } else {
                setLoading(false);
                errorScenario("vote on specific case");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            errorScenario("vote on specific case");
        }
    };

    const handleVote = async (caseId: string, side: number) => {
        const voteType = side === 0 ? "accommodation" : "customer";

        const result = await Swal.fire({
            html: `
      <div style="text-align: center;">
        <p>Are you sure you want to vote ${voteType} on this case?</p>
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
            console.log(`Confirm vote for ${voteType}.`);
            voteCase(caseId, side);
        }
    };

    const errorScenario = (status: string) => {
        setLoading(false);
        if (!loading) {
            setTimeout(() => {
                normalModal(
                    "error",
                    "Oops...",
                    `Error while trying to ${status}. Please try again later!`
                );
            }, 1000);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center mb-16">
            <div className="w-5/6 h-full flex flex-col justify-center items-center space-y-4">
                <div className="w-full md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h2 className="shrink-0 text-xl font-semibold text-darkOrange sm:text-2xl">
                        {courtCase?.name || "Loading..."}
                    </h2>
                    <span className="shrink-0 text-lg font-semibold text-primary sm:text-xl">
                        Booking Id: {courtCase?.bookingId || "Loading..."}
                    </span>
                </div>
                <div className="w-full flex flex-col justify-start items-start space-y-2">
                    <span className="font-normal text-gray-900 text-base">Customer Voted by: {courtCase?.totalCustomerVote} people</span>
                    <span className="font-normal text-gray-900 text-base">Accommodation Voted by: {courtCase?.totalAccommodationVote} people</span>
                </div>
                {/* CUSTOMER CASE */}
                {courtCase?.userCases.map((userCase) => (
                    <motion.div
                        key={userCase.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 bg-white antialiased rounded-lg drop-shadow-xl w-full relative"
                    >
                        <div className="mb-12 lg:mb-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                            <div className="shrink-0 max-w-md lg:max-w-sm mx-auto flex justify-center items-center">
                                {userCase.userEvidence ? (
                                    <img className="w-full" src={userCase.userEvidence} alt="Customer Case" />
                                ) : (
                                    <div className="flex justify-center items-center w-full h-[200px]">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-10 h-10 text-gray-200 animate-spin fill-darkOrange"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 lg:mt-0">
                                <div className="flex flex-col justify-center items-start">
                                    <span className="font-semibold text-gray-900 text-lg max-w-[200px] truncate md:max-w-none md:whitespace-normal">
                                        {userCase.userAccount}
                                    </span>
                                    <span className="font-normal text-gray-900 text-base">
                                        {`Created at: ${format(
                                            new Date(userCase.createdAt),
                                            "EEEE, dd MMMM yyyy"
                                        )}`}
                                    </span>
                                </div>
                                <hr className="my-4 border-gray-200" />
                                <p className="text-gray-500 font-normal text-base">
                                    {userCase.userArgument}
                                </p>
                                {courtCase.accommodationCases.length > 0 && courtCase.userCases.length > 0 ? (
                                    <button
                                        onClick={
                                            () => {
                                                handleVote(courtCase.id, 1);
                                            }
                                        }
                                        type="button" className="w-full mt-4 text-white bg-primary hover:bg-darkYellow focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center inline-flex justify-center items-center">
                                        <svg className="w-4 h-4 me-2 -ms-1 text-base text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                                        </svg>
                                        Vote Customer
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        type="button" className="w-full mt-4 text-white bg-gray-300 hover:bg-gray-400 focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center inline-flex justify-center items-center">
                                        <svg className="w-4 h-4 me-2 -ms-1 text-base text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                                        </svg>
                                        Vote Customer
                                    </button>
                                )}
                            </div>
                        </div>
                        <span className="bg-gray-300 text-white text-base font-medium px-2.5 py-1 rounded-md absolute bottom-4 right-4">
                            #Customer
                        </span>
                    </motion.div>
                ))}
                {/* ACCOMMODATION CASE */}
                {courtCase?.accommodationCases.map((accCase) => (
                    <motion.div
                        key={courtCase.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 bg-white antialiased rounded-lg drop-shadow-xl w-full relative"
                    >
                        <div className="mb-12 lg:mb-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                            <div className="shrink-0 max-w-md lg:max-w-sm mx-auto flex justify-center items-center">
                                {accCase.accommodationEvidence ? (
                                    <img className="w-full" src={accCase.accommodationEvidence} alt="Accommodation Case" />
                                ) : (
                                    <div className="flex justify-center items-center w-full h-[200px]">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-10 h-10 text-gray-200 animate-spin fill-darkOrange"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 lg:mt-0">
                                <div className="flex flex-col justify-center items-start">
                                    <span className="font-semibold text-gray-900 text-lg max-w-[200px] truncate md:max-w-none md:whitespace-normal">
                                        {accCase.accommodationId}
                                    </span>
                                    <span className="font-normal text-gray-900 text-base">
                                        {`Created at: ${format(
                                            new Date(courtCase.createdAt),
                                            "EEEE, dd MMMM yyyy"
                                        )}`}
                                    </span>
                                </div>
                                <hr className="my-4 border-gray-200" />
                                <p className="text-gray-500 font-normal text-base">
                                    {accCase.accommodationArgument}
                                </p>
                                {courtCase.accommodationCases.length > 0 && courtCase.userCases.length > 0 ? (
                                    <button
                                        onClick={
                                            () => {
                                                handleVote(courtCase.id, 0);
                                            }
                                        }
                                        type="button" className="w-full mt-4 text-white bg-primary hover:bg-darkYellow focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center inline-flex justify-center items-center">
                                        <svg className="w-4 h-4 me-2 -ms-1 text-base text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                                        </svg>
                                        Vote Accommodation
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        type="button" className="w-full mt-4 text-white bg-gray-300 hover:bg-gray-400 focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center inline-flex justify-center items-center">
                                        <svg className="w-4 h-4 me-2 -ms-1 text-base text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                                        </svg>
                                        Vote Accommodation
                                    </button>
                                )}
                            </div>
                        </div>
                        <span className="bg-gray-300 text-white text-base font-medium px-2.5 py-1 rounded-md absolute bottom-4 right-4">
                            #Accommodation
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CourtDetail;