import {useState, createContext} from "react";

export const ResidentCompanyContext = createContext();

export const ResidentCompanyProvider = ({ children }) => {

    const [companiesInBuilding, setCompaniesInBuilding] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState([]);

    const[selectedServiceType, setSelectedServiceType] = useState("ALL");

    const[companyModalOpen, setCompanyModalOpen] = useState(false);
    const[expandedCompanyId, setExpandedCompanyId] = useState("");
    const[expandedCompany, setExpandedCompany] = useState([]);

    return (
        <ResidentCompanyContext.Provider value={{
            companiesInBuilding, setCompaniesInBuilding,
            selectedCompanyId, setSelectedCompanyId,
            selectedCompany, setSelectedCompany,
            selectedServiceType, setSelectedServiceType,
            companyModalOpen, setCompanyModalOpen,
            expandedCompanyId, setExpandedCompanyId,
            expandedCompany, setExpandedCompany
        }}>
            {children}
        </ResidentCompanyContext.Provider>
    );
};