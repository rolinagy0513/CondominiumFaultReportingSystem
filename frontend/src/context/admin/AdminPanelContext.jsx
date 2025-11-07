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
 */


import {useState, createContext} from "react";

export const AdminPanelContext = createContext();

export const AdminPanelProvider = ({ children }) => {

    const [currentView, setCurrentView] = useState('buildings');
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const[companyNotification, setCompanyNotification] = useState(null);
    const[apartmentNotification, setApartmentNotification] = useState(null);

    return (
        <AdminPanelContext.Provider value={{
            currentView, setCurrentView,
            buildings, setBuildings,
            selectedBuilding, setSelectedBuilding,
            apartments, setApartments,
            loadingApartments, setLoadingApartments,
            companyNotification, setCompanyNotification,
            apartmentNotification, setApartmentNotification
        }}>
            {children}
        </AdminPanelContext.Provider>
    );
};