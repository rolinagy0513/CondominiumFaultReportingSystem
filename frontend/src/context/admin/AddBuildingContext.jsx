/**
 * @file AddBuildingContext.jsx
 * @description
 * React Context for managing addBuilding-related states throughout the application.
 *
 * This context provides states for the admins when they are adding a building.
 *
 * ### Responsibilities:
 * - Maintains the `addBuildingFormData` state to store admin input for adding a building.
 */


import {useState, createContext} from "react";

export const AddBuildingContext = createContext();

export const AddBuildingProvider = ({ children }) => {

    const [addBuildingFormData, setAddBuildingFormData] = useState({
        numberOfFloors:0,
        numberOfApartmentsInOneFloor:0,
        buildingNumber:0,
        address:'',
        overrides:[],
    });


    return (
        <AddBuildingContext.Provider value={{
            addBuildingFormData, setAddBuildingFormData
        }}>
            {children}
        </AddBuildingContext.Provider>
    );
};