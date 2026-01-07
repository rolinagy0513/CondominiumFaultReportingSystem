import {useState, createContext} from "react";

export const ResidentBuildingContext = createContext();

export const ResidentBuildingProvider = ({ children }) => {

    const [ownersBuilding, setOwnersBuilding] = useState([]);
    const [ownersBuildingId, setOwnersBuildingId] = useState(null);

    return (
        <ResidentBuildingContext.Provider value={{
            ownersBuilding, setOwnersBuilding,
            ownersBuildingId, setOwnersBuildingId
        }}>
            {children}
        </ResidentBuildingContext.Provider>
    );
};