/**
 * @file AdminPanelContext.jsx
 * @description
 * React Context for managing the adminPanel related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages the currentView state that sets a value that will indicate that which screen should be displayed
 * - Manages the buildings state that stores the list of buildings that are present in the system.
 * - Manages the selectedBuilding state to which decides that which building is being displayed.
 * - Manages the apartments state that stores the list of apartments for a building that is selected.
 * - Manages the loadingApartments if there is loading time than the user can see that something is happening
 * - Manages the companies state that stores the list of service companies in the system
 * - Manages loadingCompanies which indicates when company data is being fetched
 * - Manages companyNotification and apartmentNotification which store notification messages for company and apartment operations
 * - Manages companiesCurrentPage, companiesTotalPages, and companiesTotalElements which handle pagination for the companies list
 * - Manages newNotification which indicates when new notifications are available for the admin
 */

import {useState, createContext} from "react";

export const AdminPanelContext = createContext();

export const AdminPanelProvider = ({ children }) => {

    const [currentView, setCurrentView] = useState('buildings');
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const[companyNotification, setCompanyNotification] = useState(null);
    const[apartmentNotification, setApartmentNotification] = useState(null);

    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companiesCurrentPage, setCompaniesCurrentPage] = useState(0);
    const [companiesTotalPages, setCompaniesTotalPages] = useState(0);
    const [companiesTotalElements, setCompaniesTotalElements] = useState(0);
    const[newNotification, setNewNotification] = useState(false);

    return (
        <AdminPanelContext.Provider value={{
            currentView, setCurrentView,
            buildings, setBuildings,
            selectedBuilding, setSelectedBuilding,
            apartments, setApartments,
            loadingApartments, setLoadingApartments,
            companyNotification, setCompanyNotification,
            apartmentNotification, setApartmentNotification,
            companies, setCompanies, loadingCompanies, setLoadingCompanies,
            companiesCurrentPage, setCompaniesCurrentPage,
            companiesTotalPages, setCompaniesTotalPages,
            companiesTotalElements, setCompaniesTotalElements,
            newNotification, setNewNotification
        }}>
            {children}
        </AdminPanelContext.Provider>
    );
};