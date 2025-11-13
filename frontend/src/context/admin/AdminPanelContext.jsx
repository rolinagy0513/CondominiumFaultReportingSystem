/**
 * @file AdminPanelContext.jsx
 * @description
 * React Context for managing the adminPanel related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages the currentView state that sets a value that will indicate that which screen should be displayed
 */

import {useState, createContext} from "react";

export const AdminPanelContext = createContext();

export const AdminPanelProvider = ({ children }) => {

    const [currentView, setCurrentView] = useState('buildings');

    return (
        <AdminPanelContext.Provider value={{
            currentView, setCurrentView,
        }}>
            {children}
        </AdminPanelContext.Provider>
    );
};