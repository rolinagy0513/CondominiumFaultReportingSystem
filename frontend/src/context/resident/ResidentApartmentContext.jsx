import {useState, createContext} from "react";

export const ResidentApartmentContext = createContext();

export const ResidentApartmentProvider = ({ children }) => {

    const [ownersApartment, setOwnersApartment] = useState([]);
    const [ownersApartmentId, setOwnersApartmentId] = useState(null);


    return (
        <ResidentApartmentContext.Provider value={{
            ownersApartment, setOwnersApartment,
            ownersApartmentId, setOwnersApartmentId,
        }}>
            {children}
        </ResidentApartmentContext.Provider>
    );
};