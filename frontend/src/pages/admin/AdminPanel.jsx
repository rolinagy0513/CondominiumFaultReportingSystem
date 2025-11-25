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

import SideBar from "./components/SideBar.jsx";
import TopHeader from "./components/TopHeader.jsx";
import ContentArea from "./components/ContentArea.jsx";
import NotificationModal from "./components/NotificationModal.jsx";
import CompanyRequestNotification from "./components/CompanyRequestNotification.jsx";
import ApartmentRequestNotification from "./components/ApartmentRequestNotification.jsx";
import RemovalModal from "./components/RemoveModal.jsx";

import {BuildingContext} from "../../context/admin/BuildingContext.jsx";
import {ApartmentContext} from "../../context/admin/ApartmentContext.jsx";
import {NotificationContext} from "../../context/admin/NotificationContext.jsx";
import {CompanyContext} from "../../context/admin/CompanyContext.jsx";

import {useBuildings} from "../../hooks/useBuildings.js";

import "./styles/AdminPanel.css";
import {useApartments} from "../../hooks/useApartments.js";
import {useCompanies} from "../../hooks/useCompanies.js";
import {useNotifications} from "../../hooks/useNotifications.js";

const AdminPanel = () => {

    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;

    const APARTMENT_BASE_API_PATH =import.meta.env.VITE_API_BASE_APARTMENT_URL;
    const RESIDENT_APARTMENT_API_PATH = import.meta.env.VITE_API_RESIDENT_APARTMENT_URL
    const ADMIN_APARTMENT_API_PATH = import.meta.env.VITE_API_ADMIN_APARTMENT_URL

    const ADMIN_COMPANY_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_URL

    const ADMIN_APARTMENT_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_APARTMENT_REQUEST_URL
    const ADMIN_COMPANY_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_REQUEST_URL

    const SEND_APARTMENT_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_APARTMENT_REQUEST_RESPONSE_DESTINATION
    const SEND_COMPANY_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_COMPANY_REQUEST_RESPONSE_DESTINATION
    const REMOVE_RESIDENT = import.meta.env.VITE_API_ADMIN_WEBSOCKET_RESIDENT_REMOVE_DESTINATION
    const REMOVE_COMPANY = import.meta.env.VITE_ADMIN_WEBSOCKET_COMPANY_REMOVE_DESTINATION

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`
    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const ASSIGN_OWNER_URL = `${ADMIN_APARTMENT_API_PATH}/addUserToApartment`;
    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_APARTMENT_URL = `${RESIDENT_APARTMENT_API_PATH}/getByBuildingId`;
    const GET_PENDING_APARTMENT_REQUEST_URL = `${ADMIN_APARTMENT_REQUEST_API_PATH}/getPendingRequests`
    const GET_PENDING_COMPANY_REQUEST_URL = `${ADMIN_COMPANY_REQUEST_API_PATH}/getPendingRequests`
    const GET_ALL_COMPANY_URL = `${ADMIN_COMPANY_API_PATH}/getAll`
    const GET_AVAILABLE_APARTMENTS_URL = `${APARTMENT_BASE_API_PATH}/getAvailableByBuildingId`;

    const navigate = useNavigate();

    const{
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding
    } = useContext(BuildingContext);

    const{
        apartments, setApartments,
        loadingApartments, setLoadingApartments,
    } = useContext(ApartmentContext);

    const{
        companies, setCompanies,
        loadingCompanies, setLoadingCompanies,
        companiesCurrentPage, setCompaniesCurrentPage,
        companiesTotalPages, setCompaniesTotalPages,
        companiesTotalElements, setCompaniesTotalElements
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
        totalElements, setTotalElements,
        pageSize
    } = useContext(PaginationContext);

    const {
        isAdminModalOpen, setIsAdminModalOpen,
        isRemovalModalOpen, setIsRemovalModalOpen,
        apartmentRequests, setApartmentRequests,
        companyRequests, setCompanyRequests,
        targetId, setTargetId,
        modalText, setModalText,
        removalType, setRemovalType,
        modalButtonText, setModalButtonText,
        modalTitleText, setModalTitleText
    } = useContext(AdminModalContext);

    const {adminGroupId, authenticatedAdminUserName} = useContext(AdminUserContext);
    const {addBuildingFormData, setAddBuildingFormData} = useContext(AddBuildingContext);
    const {isLoading, setIsLoading, message, setMessage} = useContext(FeedbackContext);

    const { getAllBuildings, addBuilding } = useBuildings(
        GET_ALL_BUILDING_URL, ADD_BUILDING_URL,
        setBuildings, setIsLoading,
        addBuildingFormData, setAddBuildingFormData,
        setMessage, setCurrentView
    );


    const {
        getApartments, handleGetPendingApartmentRequests,
        handleAcceptApartmentRequest, handleRejectApartmentRequest,
        handleRemoveResidentFromApartment, handleAssignOwner
    } = useApartments(
        GET_APARTMENT_URL, GET_PENDING_APARTMENT_REQUEST_URL, SEND_APARTMENT_RESPONSE, REMOVE_RESIDENT,
        pageSize, currentPage, setLoadingApartments, setApartments, setCurrentPage, setTotalPages,
        setTotalElements, buildings, setSelectedBuilding, setCurrentView, setApartmentRequests,
        selectedBuilding, setTargetId, setIsRemovalModalOpen, setModalText, setModalButtonText, setModalTitleText,
        GET_AVAILABLE_APARTMENTS_URL, ASSIGN_OWNER_URL
    );

    const {
        getCompanies, handleGetPendingCompanyRequests,
        handleAcceptCompanyRequest, handleRejectCompanyRequest,
        handleRemoveCompanyFromSystem
    } = useCompanies(
        GET_ALL_COMPANY_URL, GET_PENDING_COMPANY_REQUEST_URL, SEND_COMPANY_RESPONSE, REMOVE_COMPANY,
        pageSize, setCompanies, setCompaniesCurrentPage, setCompaniesTotalPages, setCompaniesTotalElements,
        setCompanyRequests, setCurrentView, setLoadingCompanies, setTargetId, setIsRemovalModalOpen,
        setModalTitleText, setModalText, setModalButtonText
    );

    const {
        handleCloseApartmentNotification, handleCloseCompanyNotification
    } = useNotifications(
        SOCK_URL, adminGroupId, setCompanyNotification,
        setApartmentNotification, setNewNotification
    );

    const subscriptionRef = useRef(null);

    console.log(apartments)

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
                authenticatedAdminUserName={authenticatedAdminUserName}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleAddBuilding={handleAddBuilding}
                buildings={buildings}
                getApartments={getApartments}
                selectedBuilding={selectedBuilding}
                getCompanies={getCompanies}
            />

            <div className="main-content">

                <TopHeader
                    currentView={currentView}
                    selectedBuilding={selectedBuilding}
                    handleLogout={handleLogout}
                    setIsAdminModalOpen={setIsAdminModalOpen}
                    newNotification={newNotification}
                    setNewNotification={setNewNotification}
                />

                <ContentArea
                    currentView={currentView}
                    buildings={buildings}
                    handleBackToBuildings={handleBackToBuildings}
                    apartments={apartments}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalElements={totalElements}
                    loadingApartments={loadingApartments}
                    handlePageChange={handlePageChange}
                    totalPages={totalPages}
                    handleInputChange={handleInputChange}
                    addBuilding={handleAddBuildingsEvent}
                    addBuildingFormData={addBuildingFormData}
                    isLoading={isLoading}
                    message={message}
                    companies={companies}
                    setCompanies={setCompanies}
                    loadingCompanies={loadingCompanies}
                    handleCompaniesPageChange={handleCompaniesPageChange}
                    companiesCurrentPage={companiesCurrentPage}
                    companiesTotalPages={companiesTotalPages}
                    companiesTotalElements={companiesTotalElements}
                    setIsRemovalModalOpen={setIsRemovalModalOpen}
                    setTargetId={setTargetId}
                    setRemovalType={setRemovalType}
                    setModalButtonText={setModalButtonText}
                    setModalText={setModalText}
                    setModalTitleText={setModalTitleText}
                    handleAssignOwner={handleAssignOwner}
                />

            </div>

            <div>
                {isAdminModalOpen &&
                    <NotificationModal
                        setIsAdminModalOpen={setIsAdminModalOpen}
                        apartmentRequests={apartmentRequests}
                        companyRequests={companyRequests}
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
                        targetId={targetId}
                        isRemovalModalOpen={isRemovalModalOpen}
                        setIsRemovalModalOpen={setIsRemovalModalOpen}
                        handleRemoveFunction={handleRemoval}
                        text={modalText}
                        buttonText={modalButtonText}
                        titleText={modalTitleText}
                    />
                )}

            </div>

        </div>
    );
};

export default AdminPanel;