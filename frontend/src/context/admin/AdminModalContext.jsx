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
 */


import {useState, createContext} from "react";

export const AdminModalContext = createContext();

export const AdminModalProvider = ({ children }) => {

    const[isAdminModalOpen, setIsAdminModalOpen] = useState(false);


    return (
        <AdminModalContext.Provider value={{
            isAdminModalOpen, setIsAdminModalOpen
        }}>
            {children}
        </AdminModalContext.Provider>
    );
};