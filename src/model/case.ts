export interface Case {
    id: string;
    bookingId: string;
    name: string;
    createdAt: string;
    userCases: {
        id: string;
        userAccount: string;
        userArgument: string;
        userEvidence: string;
        createdAt: string;
    }[];
    accommodationCases: {
        id: string;
        accommodationId: string;
        accommodationArgument: string;
        accommodationEvidence: string;
        createdAt: string;
    }[];
    totalCustomerVote: number;
    totalAccommodationVote: number;
}