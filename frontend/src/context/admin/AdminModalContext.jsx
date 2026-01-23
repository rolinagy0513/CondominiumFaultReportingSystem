/**
 * @file AdminModalContext.jsx
 * @description
 * React Context for managing the AdminModal related states.
 *
 * This context provides states for the Notification modal in the AdminPanel
 *
 * ### Responsibilities:
 * - Manages isAdminModalOpen which decides that a model is displayed or not.
 * - Manages the setIsAdminModalOpen which sets that the modal should be open or not.
 * - Manages the apartmentRequest and companyRequest states and their setter to store the apartment request and company request arrays
 * - Manages isRemovalModalOpen which controls the visibility of the removal confirmation modal
 * - Manages targetId and targetCompanyId which store the IDs of entities targeted for removal
 * - Manages modalText, modalButtonText, and modalTitleText which configure the modal content and appearance
 * - Manages removalType which specifies the type of entity being removed (apartment, company, etc.)
 */

import {useState, createContext} from "react";

export const AdminModalContext = createContext();

export const AdminModalProvider = ({ children }) => {

    const[isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const[isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);
    const[targetId, setTargetId] = useState(null);
    const[targetCompanyId, setTargetCompanyId] = useState(null)
    const[apartmentRequests, setApartmentRequests] = useState([]);
    const[companyRequests, setCompanyRequests] = useState([]);
    const[modalText, setModalText] = useState("");
    const[modalButtonText, setModalButtonText] = useState("");
    const[modalTitleText, setModalTitleText] = useState("");
    const[removalType, setRemovalType] = useState("");
    const[addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);


    return (
        <AdminModalContext.Provider value={{
            isAdminModalOpen, setIsAdminModalOpen,
            isRemovalModalOpen,setIsRemovalModalOpen,
            apartmentRequests, setApartmentRequests,
            companyRequests, setCompanyRequests,
            targetId, setTargetId,
            targetCompanyId, setTargetCompanyId,
            modalText, setModalText,
            removalType, setRemovalType,
            modalButtonText, setModalButtonText,
            modalTitleText, setModalTitleText,
            addCompanyModalOpen, setAddCompanyModalOpen
        }}>
            {children}
        </AdminModalContext.Provider>
    );
};