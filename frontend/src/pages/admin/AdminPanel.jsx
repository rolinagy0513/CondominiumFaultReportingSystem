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
import RemovalModal from "./components/RemoveModal.jsx";

import "./styles/AdminPanel.css";
import ApartmentRequestnotification from "./components/ApartmentRequestnotification.jsx";

const AdminPanel = () => {
    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const RESIDENT_APARTMENT_API_PATH = import.meta.env.VITE_API_RESIDENT_APARTMENT_URL

    const ADMIN_COMPANY_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_URL

    const ADMIN_APARTMENT_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_APARTMENT_REQUEST_URL
    const ADMIN_COMPANY_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_REQUEST_URL

    const SEND_APARTMENT_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_APARTMENT_REQUEST_DESTINATION
    const SEND_COMPANY_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_COMPANY_REQUEST_DESTINATION
    const REMOVE_RESIDENT = import.meta.env.VITE_API_ADMIN_WEBSOCKET_RESIDENT_REMOVE_DESTINATION

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`
    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_APARTMENT_URL = `${RESIDENT_APARTMENT_API_PATH}/getByBuildingId`;
    const GET_PENDING_APARTMENT_REQUEST_URL = `${ADMIN_APARTMENT_REQUEST_API_PATH}/getPendingRequests`
    const GET_PENDING_COMPANY_REQUEST_URL = `${ADMIN_COMPANY_REQUEST_API_PATH}/getPendingRequests`
    const GET_ALL_COMPANY_URL = `${ADMIN_COMPANY_API_PATH}/getAll`

    const navigate = useNavigate();

    //Bugos a remove resident meg van oldva mert már megkapja az id-t de valamiért nem veszi ki
    //Company remove ugyan úgy meg kell csinálni
    //A welcome page ahol majd lehet küldeni a requesteket
    //Report rendszer

    const {
        currentView, setCurrentView,
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding,
        apartments, setApartments,
        loadingApartments, setLoadingApartments,
        companyNotification, setCompanyNotification,
        apartmentNotification, setApartmentNotification,
        companies, setCompanies,
        loadingCompanies, setLoadingCompanies,
        companiesCurrentPage, setCompaniesCurrentPage,
        companiesTotalPages, setCompaniesTotalPages,
        companiesTotalElements, setCompaniesTotalElements
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
        targetApartmentId, setTargetApartmentId,
    } = useContext(AdminModalContext);

    const {adminGroupId, authenticatedAdminUserName} = useContext(AdminUserContext);
    const {addBuildingFormData, setAddBuildingFormData} = useContext(AddBuildingContext);
    const {isLoading, setIsLoading, message, setMessage} = useContext(FeedbackContext);

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
        }

        if (notification.type === 'APARTMENT_REQUEST'){
            setApartmentNotification(notification);
        }
    };

    const handleCloseApartmentNotification = () =>{
        setApartmentNotification(null)
    }

    const handleCloseCompanyNotification = () => {
        setCompanyNotification(null);
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

    const getAllBuildings = async() => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const getApartments = async(buildingId, page = 0) => {
        setLoadingApartments(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_APARTMENT_URL}/${buildingId}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setApartments(response.content);
                setCurrentPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setApartments([]);
                setCurrentPage(0);
                setTotalPages(0);
                setTotalElements(0);
            }

            const building = buildings.find(b => b.id === buildingId);
            setSelectedBuilding(building);
            setCurrentView('apartments');

        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const addBuilding = async(e) =>{

        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await apiServices.post(`${ADD_BUILDING_URL}`,addBuildingFormData);

            setAddBuildingFormData({
                numberOfFloors: 0,
                numberOfApartmentsInOneFloor: 0,
                buildingNumber: 0,
                address: '',
                overrides: [],
            });

            await getAllBuildings();

            setCurrentView('buildings');

        }catch (error){
            console.error(error.message);
            setMessage(error.message)
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }

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

    const handleGetPendingApartmentRequests = async () =>{

        try {

            const response = await apiServices.get(GET_PENDING_APARTMENT_REQUEST_URL)

            setApartmentRequests(response || []);

        }catch (error){
            console.error(error.message)
        }

    }

    const handleGetPendingCompanyRequests = async() =>{

        try {

            const response = await apiServices.get(GET_PENDING_COMPANY_REQUEST_URL)

            setCompanyRequests(response || [])

        }catch (error){
            console.error(error.message)
        }

    }

    const handleAcceptApartmentRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'ACCEPTED'
        })

        const success = websocketServices.sendMessage(
            SEND_APARTMENT_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Accepted apartment request ID: ${requestId}`);
            setApartmentRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send acceptance via WebSocket');
        }

    };

    const handleRejectApartmentRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'REJECTED'
        })

        const success = websocketServices.sendMessage(
            SEND_APARTMENT_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Rejected apartment request ID: ${requestId}`);
            setApartmentRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send reluctance via WebSocket');
        }

    };

    const handleAcceptCompanyRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'ACCEPTED'
        })

        const success = websocketServices.sendMessage(
            SEND_COMPANY_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Accepted company request ID: ${requestId}`);
            setCompanyRequests(prev => prev.filter(request => request.requestId !== requestId));
        } else {
            console.error('Failed to send acceptance via WebSocket');
        }

    };

    const handleRejectCompanyRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'REJECTED'
        })

        const success = websocketServices.sendMessage(
            SEND_COMPANY_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Rejected company request ID: ${requestId}`);
            setCompanyRequests(prev => prev.filter(request => request.requestId !== requestId));
        } else {
            console.error('Failed to send reluctance via WebSocket');
        }

    };

    const getCompanies = async (page = 0) => {
        setLoadingCompanies(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_ALL_COMPANY_URL}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setCompanies(response.content);
                setCompaniesCurrentPage(response.number);
                setCompaniesTotalPages(response.totalPages);
                setCompaniesTotalElements(response.totalElements);
            } else {
                setCompanies([]);
                setCompaniesCurrentPage(0);
                setCompaniesTotalPages(0);
                setCompaniesTotalElements(0);
            }

            setCurrentView('companies');
        } catch (error) {
            console.error("Error fetching companies:", error.message);
            setCompanies([]);
            setCompaniesCurrentPage(0);
            setCompaniesTotalPages(0);
            setCompaniesTotalElements(0);
        } finally {
            setLoadingCompanies(false);
        }
    }

    const handleRemoveResidentFromApartment = (apartmentId) =>{

        console.log(apartmentId)

        const success = websocketServices.sendMessage(
          REMOVE_RESIDENT, apartmentId
        );

        if (success) {
            console.log(`Removal request sent for apartment ID: ${apartmentId}`);
            if (selectedBuilding) {
                getApartments(selectedBuilding.id, currentPage);
            }

            setTargetApartmentId(null);
            setIsRemovalModalOpen(false);

        } else {
            console.error('Failed to send removal request via WebSocket');
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
                    addBuilding={addBuilding}
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
                    setTargetApartmentId={setTargetApartmentId}
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
                    <ApartmentRequestnotification
                    notification={apartmentNotification}
                    onClose={handleCloseApartmentNotification}
                    />
                )}

                {isRemovalModalOpen && (
                    <RemovalModal
                        targetApartmentId={targetApartmentId}
                        isRemovalModalOpen={isRemovalModalOpen}
                        setIsRemovalModalOpen={setIsRemovalModalOpen}
                        handleRemoveResidentFromApartment={handleRemoveResidentFromApartment}
                    />
                )}

            </div>

        </div>
    );
};

export default AdminPanel;