import {useState, createContext} from "react";

export const ResidentCompanyContext = createContext();

export const ResidentCompanyProvider = ({ children }) => {

    const [companiesInBuilding, setCompaniesInBuilding] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState([]);

    const[selectedServiceType, setSelectedServiceType] = useState("ALL");

    return (
        <ResidentCompanyContext.Provider value={{
            companiesInBuilding, setCompaniesInBuilding,
            selectedCompanyId, setSelectedCompanyId,
            selectedCompany, setSelectedCompany,
            selectedServiceType, setSelectedServiceType,
        }}>
            {children}
        </ResidentCompanyContext.Provider>
    );
};