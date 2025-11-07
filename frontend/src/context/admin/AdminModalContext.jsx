/**
 * @file AdminModalContext.jsx
 * @description
 * React Context for managing the AdminModal related states.
 *
 * This context provides states for the Notification modal in the AdminPAnel
 *
 * ### Responsibilities:
 * - Manages isAdminModalOpen which decides that a model is displayed or not.
 * - Manages the setIsAdminModalOpen which sets that the modal should be open or not.
 * - Manages the apartmentRequest and companyRequest states and their setter to store the apartment request and company request arrays
 */


import {useState, createContext} from "react";

export const AdminModalContext = createContext();

export const AdminModalProvider = ({ children }) => {

    const[isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const[apartmentRequests, setApartmentRequests] = useState([]);
    const[companyRequests, setCompanyRequests] = useState([]);


    return (
        <AdminModalContext.Provider value={{
            isAdminModalOpen, setIsAdminModalOpen,
            apartmentRequests, setApartmentRequests,
            companyRequests, setCompanyRequests
        }}>
            {children}
        </AdminModalContext.Provider>
    );
};