/**
 * @file AdminPanelContext.jsx
 * @description
 * React Context for managing the adminPanel related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages the companies state that stores the list of service companies in the system
 * - Manages loadingCompanies which indicates when company data is being fetched
 * - Manages companyNotification and apartmentNotification which store notification messages for company and apartment operations
 * - Manages companiesCurrentPage, companiesTotalPages, and companiesTotalElements which handle pagination for the companies list
 */

import {useState, createContext} from "react";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companiesCurrentPage, setCompaniesCurrentPage] = useState(0);
    const [companiesTotalPages, setCompaniesTotalPages] = useState(0);
    const [companiesTotalElements, setCompaniesTotalElements] = useState(0);
    const [selectedServiceType, setSelectedServiceType] = useState("ALL");

    return (
        <CompanyContext.Provider value={{
            companies, setCompanies, loadingCompanies, setLoadingCompanies,
            companiesCurrentPage, setCompaniesCurrentPage,
            companiesTotalPages, setCompaniesTotalPages,
            companiesTotalElements, setCompaniesTotalElements,
            selectedServiceType, setSelectedServiceType,
        }}>
            {children}
        </CompanyContext.Provider>
    );
};