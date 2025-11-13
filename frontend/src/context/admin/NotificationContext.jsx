/**
 * @file AdminPanelContext.jsx
 * @description
 * React Context for managing the adminPanel related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages companyNotification and apartmentNotification which store notification messages for company and apartment operations
 * - Manages newNotification which indicates when new notifications are available for the admin
 */

import {useState, createContext} from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

    const [companyNotification, setCompanyNotification] = useState(null);
    const [newNotification, setNewNotification] = useState(false);
    const [apartmentNotification, setApartmentNotification] = useState(null);

    return (
        <NotificationContext.Provider value={{
            companyNotification, setCompanyNotification,
            newNotification, setNewNotification,
            apartmentNotification, setApartmentNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};