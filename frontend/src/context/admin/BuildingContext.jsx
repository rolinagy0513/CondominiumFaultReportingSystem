/**
 * @file BuildingContext.jsx
 * @description
 * React Context for managing the building related states.
 *
 * This context provides states for the adminPanel.
 *
 * ### Responsibilities:
 * - Manages the buildings state that stores the list of buildings that are present in the system.
 * - Manages the selectedBuilding state to which decides that which building is being displayed.
 */

import {useState, createContext} from "react";

export const BuildingContext = createContext();

export const BuildingProvider = ({ children }) => {

    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    return (
        <BuildingContext.Provider value={{
            buildings, setBuildings,
            selectedBuilding, setSelectedBuilding
        }}>
            {children}
        </BuildingContext.Provider>
    );
};