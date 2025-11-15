import {useState, createContext} from "react";

export const RoleSelectionContext = createContext();

export const RoleSelectionProvider = ({ children }) => {

    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    return (
        <RoleSelectionContext.Provider value={{
            buildings, setBuildings,
            selectedBuilding,setSelectedBuilding,
            apartments, setApartments,
            loadingApartments, setLoadingApartments,
            currentPage, setCurrentPage,
            totalPages, setTotalPages,
            totalElements, setTotalElements,
            pageSize
        }}>
            {children}
        </RoleSelectionContext.Provider>
    );
};