import {useState, createContext} from "react";

export const ResidentRequestContext = createContext();

export const ResidentRequestProvider = ({ children }) => {


    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;
    const [showPendingView, setShowPendingView] = useState(false);
    const [notification, setNotification] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    return (
        <ResidentRequestContext.Provider value={{
            buildings, setBuildings,
            selectedBuilding,setSelectedBuilding,
            apartments, setApartments,
            loadingApartments, setLoadingApartments,
            currentPage, setCurrentPage,
            totalPages, setTotalPages,
            totalElements, setTotalElements,
            pageSize,
            showPendingView, setShowPendingView,
            notification, setNotification,
            requestSent, setRequestSent,
            selectedApartmentId, setSelectedApartmentId,
            isConnected, setIsConnected
        }}>
            {children}
        </ResidentRequestContext.Provider>
    );
};