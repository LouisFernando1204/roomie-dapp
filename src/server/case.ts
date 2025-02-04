/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BACKEND_API_URL } from "../global/global";

export async function createUserCase(
    _userAccount: string,
    _userArgument: string,
    _userEvidence: string,
    _bookingId: string,
    _caseName: string
) {
    try {
        const res = await axios.post(`${BACKEND_API_URL}cases`, {
            userAccount: _userAccount,
            userArgument: _userArgument,
            userEvidence: _userEvidence,
            bookingId: _bookingId,
            caseName: _caseName
        });
        return res;
    } catch (error) {
        console.log(error);
        return;
    }
}

export async function createAccommodationCase(
    _accommodationId: string,
    _accommodationArgument: string,
    _accommodationEvidence: string,
    _bookingId: string,
    _caseName: string
) {
    try {
        const res = await axios.post(`${BACKEND_API_URL}cases`, {
            accommodationId: _accommodationId,
            accommodationArgument: _accommodationArgument,
            accommodationEvidence: _accommodationEvidence,
            bookingId: _bookingId,
            caseName: _caseName
        });
        return res;
    } catch (error) {
        console.log(error);
        return;
    }
}

export async function getAllCases() {
    try {
        const res = await axios.get(`${BACKEND_API_URL}cases`);
        return structuredCases(res.data);
    } catch (error) {
        console.log(error);
        return;
    }
}

export async function getCaseById(_caseId: string) {
    try {
        const res = await axios.get(`${BACKEND_API_URL}cases/${_caseId}`);
        return structuredCase(res.data);
    } catch (error) {
        console.log(error);
        return;
    }
}

function structuredCases(cases: any) {
    return cases.map((caseItem: any) => ({
        id: caseItem._id,
        bookingId: caseItem.bookingId,
        name: caseItem.name,
        createdAt: caseItem.createdAt,
        updatedAt: caseItem.updatedAt,
        userCases: caseItem.userCaseId.map((userCase: any) => ({
            id: userCase._id,
            userAccount: userCase.userAccount,
            userArgument: userCase.userArgument,
            userEvidence: userCase.userEvidence,
            createdAt: userCase.createdAt,
            updatedAt: userCase.updatedAt,
        })),
        accommodationCases: caseItem.accommodationCaseId.map((accommodationCase: any) => ({
            id: accommodationCase._id,
            accommodationId: accommodationCase.accommodationId,
            accommodationArgument: accommodationCase.accommodationArgument,
            accommodationEvidence: accommodationCase.accommodationEvidence,
            createdAt: accommodationCase.createdAt,
            updatedAt: accommodationCase.updatedAt,
        })),
    }));
}

function structuredCase(caseItem: any) {
    return {
        id: caseItem._id,
        bookingId: caseItem.bookingId,
        name: caseItem.name,
        createdAt: caseItem.createdAt,
        updatedAt: caseItem.updatedAt,
        userCases: caseItem.userCaseId.map((userCase: any) => ({
            id: userCase._id,
            userAccount: userCase.userAccount,
            userArgument: userCase.userArgument,
            userEvidence: userCase.userEvidence,
            createdAt: userCase.createdAt,
            updatedAt: userCase.updatedAt,
        })),
        accommodationCases: caseItem.accommodationCaseId.map((accommodationCase: any) => ({
            id: accommodationCase._id,
            accommodationId: accommodationCase.accommodationId,
            accommodationArgument: accommodationCase.accommodationArgument,
            accommodationEvidence: accommodationCase.accommodationEvidence,
            createdAt: accommodationCase.createdAt,
            updatedAt: accommodationCase.updatedAt,
        })),
    };
}  