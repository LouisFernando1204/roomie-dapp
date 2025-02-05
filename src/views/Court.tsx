/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Case } from "../model/case";
import { normalModal } from "../utils/helper";
import { caseDetail } from "../services/public";
import { getAllCases } from "../server/case";
import { EmptyPage } from "./EmptyPage";
import { format } from "date-fns";
import 'animate.css';
import { motion } from "framer-motion";
import { LoadingScreen } from "../components/ui/loading-screen";

const Court = () => {

  const [loading, setLoading] = useState(true);
  const [courtCases, setCourtCases] = useState<Case[]>([]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await getAllCases();
      if (res) {
        const structuredCourtCases = await Promise.all(
          res.map(async (courtCase: Case) => {
            const caseDetailData = await caseDetail(
              courtCase.id
            );
            return {
              ...courtCase,
              totalCustomerVote: caseDetailData.totalCustomerVote,
              totalAccommodationVote: caseDetailData.totalHostVote
            };
          })
        );
        setLoading(false);
        setCourtCases(structuredCourtCases);
      } else {
        setLoading(false);
        errorScenario("get all cases");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      errorScenario("get all cases");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mb-16">
      <div className="w-5/6 h-full flex flex-col justify-center items-center space-y-6">
        <div className="w-full">
          <h2 className="shrink-0 text-xl font-semibold text-darkOrange sm:text-2xl">Accommodation Cases</h2>
        </div>
        {courtCases.length > 0 ? (
          courtCases.map((courtCase) => (
            <motion.div
              key={courtCase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white antialiased rounded-lg drop-shadow-xl w-full">
              <div className="p-4">
                <div className="space-y-2 flex flex-col">
                  <div className="grid gap-6">
                    <div className="w-full flex flex-col space-y-4 justify-start items-start">
                      <span className="rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 md:mb-0">
                        {courtCase.accommodationCases.length > 0 && courtCase.userCases.length > 0 ? (
                          <span>Completed</span>
                        ) : courtCase.accommodationCases.length === 0 ? (
                          <span>Waiting for accommodation</span>
                        ) : (
                          <span>Waiting for customer</span>
                        )}
                      </span>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">{courtCase.name}</span>
                  </div>
                  <span className="text-base font-normal text-gray-500">Booking Id: {courtCase.bookingId}</span>
                  <span className="text-base font-normal text-gray-500">Customer Voted by: {courtCase.totalCustomerVote} people</span>
                  <span className="text-base font-normal text-gray-500">Accommodation Voted by: {courtCase.totalAccommodationVote} people</span>
                  <span className="text-base font-normal text-gray-500">
                    {`Created at: ${format(
                      new Date(courtCase.createdAt),
                      "EEEE, dd MMMM yyyy"
                    )}`}
                  </span>
                </div>
                <Link to={`/court/${courtCase.id}`}>
                  <button type="button" className="mt-6 w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none">View details</button>
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="mt-20">
            <EmptyPage
              title="No Cases Found"
              text="Great news! You have no ongoing cases. We hope everything is going smoothly with your accommodation."
            />
          </div>
        )
        }
      </div>
    </div>
  )
}

export default Court;