import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import {AddBuildingContext} from "../../context/admin/AddBuildingContext.jsx";
import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AdminPanelContext} from "../../context/admin/AdminPanelContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";
import {AdminModalContext} from "../../context/admin/AdminModalContext.jsx";
import {AdminUserContext} from "../../context/admin/AdminUserContext.jsx";
import {BuildingContext} from "../../context/admin/BuildingContext.jsx";
import {ApartmentContext} from "../../context/admin/ApartmentContext.jsx";
import {NotificationContext} from "../../context/admin/NotificationContext.jsx";
import {CompanyContext} from "../../context/admin/CompanyContext.jsx";

import SideBar from "./components/SideBar.jsx";
import TopHeader from "./components/TopHeader.jsx";
import ContentArea from "./components/ContentArea.jsx";
import NotificationModal from "./components/NotificationModal.jsx";
import CompanyRequestNotification from "./components/CompanyRequestNotification.jsx";
import ApartmentRequestNotification from "./components/ApartmentRequestNotification.jsx";
import RemovalModal from "./components/RemoveModal.jsx";

import {useBuildings} from "../../hooks/useBuildings.js";
import {useApartments} from "../../hooks/useApartments.js";
import {useCompanies} from "../../hooks/useCompanies.js";
import {useNotifications} from "../../hooks/useNotifications.js";
import {useExcelOperations} from "../../hooks/useExcelOperations.js";

import "./styles/AdminPanel.css";
import AddCompanyModal from "./components/AddCompanyModal.jsx";

const AdminPanel = () => {

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`

    const navigate = useNavigate();

    const{
        buildings, selectedBuilding, setSelectedBuilding
    } = useContext(BuildingContext);

    const{
        apartments, setApartments,
        loadingApartments,
    } = useContext(ApartmentContext);

    const{
        companies, setCompanies,
        loadingCompanies, companiesCurrentPage,
        companiesTotalPages, companiesTotalElements,
    } = useContext(CompanyContext);

    const{
        companyNotification, setCompanyNotification,
        apartmentNotification, setApartmentNotification,
        newNotification, setNewNotification
    } = useContext(NotificationContext);

    const {
        currentView, setCurrentView,
    } = useContext(AdminPanelContext);

    const {
        currentPage, setCurrentPage,
        totalPages, setTotalPages,
        totalElements, pageSize
    } = useContext(PaginationContext);

    const {
        isAdminModalOpen, setIsAdminModalOpen,
        isRemovalModalOpen, setIsRemovalModalOpen,
        apartmentRequests, companyRequests,
        targetId, setTargetId,
        modalText, setModalText,
        removalType, setRemovalType,
        modalButtonText, setModalButtonText,
        modalTitleText, setModalTitleText,
        addCompanyModalOpen
    } = useContext(AdminModalContext);

    const {
        addBuildingFormData, setAddBuildingFormData
    } = useContext(AddBuildingContext);

    const {adminGroupId} = useContext(AdminUserContext);
    const {isLoading, message, setMessage} = useContext(FeedbackContext);

    const {
        getAllBuildings, addBuilding
    } = useBuildings();

    const {
        getApartments, handleGetPendingApartmentRequests,
        handleAcceptApartmentRequest, handleRejectApartmentRequest,
        handleRemoveResidentFromApartment, handleAssignOwner
    } = useApartments();

    const {
        getCompanies, handleGetPendingCompanyRequests,
        handleAcceptCompanyRequest, handleRejectCompanyRequest,
        handleRemoveCompanyFromSystem,getCompaniesByServiceType
    } = useCompanies();

    const {
        handleCloseApartmentNotification, handleCloseCompanyNotification
    } = useNotifications();

    const{ getExcelTemplate, uploadExcelFile } = useExcelOperations();

    const subscriptionRef = useRef(null);

    useEffect(() => {
        getAllBuildings();
    }, []);

    useEffect(() => {
        if (isAdminModalOpen) {
            handleGetPendingApartmentRequests();
            handleGetPendingCompanyRequests();
            console.log("The requests fetching has been called")
        }
    }, [isAdminModalOpen]);

    useEffect(() => {
        if (!adminGroupId) {
            console.log("⚠️ No adminGroupId, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Admin WebSocket connected successfully");

                const topic = `/topic/group/${adminGroupId}`;

                subscriptionRef.current = websocketServices.subscribe(
                    topic,
                    handleNotification
                );

                if (subscriptionRef.current) {
                    console.log("✅ Successfully subscribed to group notifications");
                } else {
                    console.error("❌ Failed to subscribe");
                }
            },
            onDisconnect: () => {
                console.log("🔌 Admin WebSocket disconnected");
                subscriptionRef.current = null;
            },
            onError: (error) => {
                console.error("❌ WebSocket error:", error);
                subscriptionRef.current = null;
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            withCredentials: true
        });

        return () => {
            console.log("🧹 Cleaning up WebSocket subscriptions...");

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            websocketServices.disconnect();
        };
    }, [adminGroupId]);

    const handleNotification = (notification) => {
        if (notification.type === 'COMPANY_REQUEST') {
            setCompanyNotification(notification);
            setNewNotification(true)
        }

        if (notification.type === 'APARTMENT_REQUEST'){
            setApartmentNotification(notification);
            setNewNotification(true)
        }
    };

    const handleAddBuilding = () => {
        setCurrentView('add-building');
    };

    const handleInputChange = (e) => {
        setMessage("");
        const { name, value, type } = e.target;

        const processedValue = type === 'number' ?
            (value === '' ? 0 : parseInt(value, 10)) :
            value;

        setAddBuildingFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const handleBackToBuildings = () => {
        setCurrentView('buildings');
        setSelectedBuilding(null);
        setApartments([]);
        setCurrentPage(0);
        setTotalPages(0);
    };

    const handleAddBuildingsEvent = (e) =>{
        e.preventDefault();
        addBuilding();
    }

    const handlePageChange = (newPage) => {
        if (selectedBuilding && newPage >= 0 && newPage < totalPages) {
            getApartments(selectedBuilding.id, newPage);
        }
    };

    const handleCompaniesPageChange = (newPage) => {
        if (newPage >= 0 && newPage < companiesTotalPages) {
            getCompanies(newPage);
        }
    };


    const handleRemoval = (targetId) =>{
        if (removalType === "apartment"){
            handleRemoveResidentFromApartment(targetId)
        }if (removalType === "company"){
            handleRemoveCompanyFromSystem(targetId)
        }
    }

    const handleLogout = async () =>{

        try {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            websocketServices.disconnect();

            await apiServices.post(LOGOUT_URL);
            localStorage.removeItem("authenticatedAdminId");
            localStorage.removeItem("authenticatedAdminUserName");

            navigate("/");

        }catch (error){
            console.error(error.message);
        }

    }

    return (
        <div className="admin-panel">

            <SideBar
                handleAddBuilding={handleAddBuilding}
                getApartments={getApartments}
                getCompanies={getCompanies}
            />

            <div className="main-content">

                <TopHeader
                    handleLogout={handleLogout}
                />

                <ContentArea
                    handleBackToBuildings={handleBackToBuildings}
                    handlePageChange={handlePageChange}
                    handleInputChange={handleInputChange}
                    addBuilding={handleAddBuildingsEvent}
                    handleCompaniesPageChange={handleCompaniesPageChange}
                    handleAssignOwner={handleAssignOwner}
                    getExcelTemplate={getExcelTemplate}
                    uploadExcelFile={uploadExcelFile}
                    getCompanies={getCompanies}
                    getCompaniesByServiceType={getCompaniesByServiceType}
                />

            </div>

            <div>
                {isAdminModalOpen &&
                    <NotificationModal
                        handleAcceptApartmentRequest={handleAcceptApartmentRequest}
                        handleRejectApartmentRequest={handleRejectApartmentRequest}
                        handleAcceptCompanyRequest={handleAcceptCompanyRequest}
                        handleRejectCompanyRequest={handleRejectCompanyRequest}
                     />}

                {companyNotification && (
                    <CompanyRequestNotification
                        notification={companyNotification}
                        onClose={handleCloseCompanyNotification}
                    />
                )}

                {apartmentNotification && (
                    <ApartmentRequestNotification
                    notification={apartmentNotification}
                    onClose={handleCloseApartmentNotification}
                    />
                )}

                {isRemovalModalOpen && (
                    <RemovalModal
                        handleRemoveFunction={handleRemoval}
                        text={modalText}
                        buttonText={modalButtonText}
                        titleText={modalTitleText}
                    />
                )}

                {addCompanyModalOpen && (
                    <AddCompanyModal/>
                )}

            </div>

        </div>
    );
};

export default AdminPanel;