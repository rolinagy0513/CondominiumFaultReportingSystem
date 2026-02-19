import {createContext, useState, useEffect} from "react";

export const CompanyReportContext = createContext()

export const CompanyReportProvider = ({children}) => {

    const [privateReports, setPrivateReports] = useState([]);
    const [acceptedReports, setAcceptedReports] = useState([]);
    const [reportToCompleteId, setReportToCompleteId] = useState(null);


    const reportTypeIcons = {
        ELECTRICITY: "⚡",
        LIGHTNING: "💡",
        WATER_SUPPLY: "💧",
        SEWAGE: "🚽",
        HEATING: "🔥",
        ELEVATOR: "🛗",
        GARBAGE_COLLECTION: "🗑️",
        SECURITY: "🔒",
        GARDENING: "🌳",
        OTHER: "📋"
    };


    return (
        <CompanyReportContext.Provider value={
            {
                privateReports, setPrivateReports,
                acceptedReports, setAcceptedReports,
                reportTypeIcons, reportToCompleteId,
                setReportToCompleteId
            }
        }>
            {children}
        </CompanyReportContext.Provider>
    );
};