import {useState, createContext} from "react";

export const ResidentReportContext = createContext();

export const ResidentReportProvider = ({ children }) => {

    const [publicReports, setPublicReports] = useState([]);
    const [inProgressReports, setInProgressReports] = useState([]);
    const [completedReports, setCompletedReports] = useState([]);

    const [showReportForm, setShowReportForm] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        name: '',
        issueDescription: '',
        comment: '',
        reportType: 'ELECTRICITY'
    });

    const [showPrivateReportForm, setShowPrivateReportForm] = useState(false);
    const [privateReportFormData, setPrivateReportData] = useState({
        name: '',
        issueDescription: '',
        comment: '',
        reportType: ''
    })

    const [completeReportModalOpen, setCompleteReportModalOpen] = useState(false);

    const [selectedCompanyServiceType, setSelectedCompanyServiceType] = useState("");

    return (
        <ResidentReportContext.Provider value={{
            publicReports, setPublicReports,
            inProgressReports, setInProgressReports,
            completedReports, setCompletedReports,
            showReportForm, setShowReportForm,
            reportFormData, setReportFormData,
            showPrivateReportForm, setShowPrivateReportForm,
            privateReportFormData, setPrivateReportData,
            completeReportModalOpen, setCompleteReportModalOpen,
            selectedCompanyServiceType, setSelectedCompanyServiceType
        }}>
            {children}
        </ResidentReportContext.Provider>
    );
};