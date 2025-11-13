/**
 * @file ApartmentContext.jsx
 * @description
 * React Context for managing the apartment related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages the apartments state that stores the list of apartments for a building that is selected.
 * - Manages the loadingApartments if there is loading time than the user can see that something is happening
 */

import {useState, createContext} from "react";

export const ApartmentContext = createContext();

export const ApartmentProvider = ({ children }) => {

    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);


    return (
        <ApartmentContext.Provider value={{
            apartments, setApartments,
            loadingApartments, setLoadingApartments,
        }}>
            {children}
        </ApartmentContext.Provider>
    );
};