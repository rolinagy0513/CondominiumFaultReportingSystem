import BuildingsList from "../admin/components/BuildingsList.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {RoleSelectionContext} from "../../context/role-selection/RoleSelectionContext.jsx";
import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";
import {UserContext} from "../../context/general/UserContext.jsx";

import "./styles/ResidentRequest.css"
import {ResidentRequestContext} from "../../context/role-selection/ResidentRequestContext.jsx";

const ResidentRequest = () => {
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL
    const APARTMENT_BASE_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;
    const SEND_APARTMENT_REQUEST = import.meta.env.VITE_API_WEBSOCKET_APARTMENT_REQUEST_SEND_DESTINATION;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`
    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_AVAILABLE_APARTMENTS_URL = `${APARTMENT_BASE_API_PATH}/getAvailableByBuildingId`;

    const {authenticatedUserId} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const {
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
    } = useContext(ResidentRequestContext);

    // const{
    //     buildings, setBuildings,
    //     selectedBuilding, setSelectedBuilding,
    //     apartments, setApartments,
    //     loadingApartments, setLoadingApartments,
    //     currentPage, setCurrentPage,
    //     totalPages, setTotalPages,
    //     totalElements, setTotalElements,
    //     pageSize,
    //     showPendingView, setShowPendingView,
    // } = useContext(RoleSelectionContext);

    // const [notification, setNotification] = useState(null);
    // const [requestSent, setRequestSent] = useState(false);
    // const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    // const [isConnected, setIsConnected] = useState(false);

    const subscriptionRef = useRef(null);
    const currentUserIdRef = useRef(null);

    useEffect(() => {
        getAllBuildings();
    }, []);

    useEffect(() => {
        if (currentUserIdRef.current !== authenticatedUserId) {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            const hasActiveResidentRequest = location.state?.hasActiveResidentRequest;
            setShowPendingView(hasActiveResidentRequest || false);

            currentUserIdRef.current = authenticatedUserId;
            setNotification(null);
            setRequestSent(false);
            setSelectedApartmentId(null);
            setIsConnected(false);
        }

        if (authenticatedUserId) {
            setupWebSocket();
        }

        return () => cleanupWebSocket();
    }, [authenticatedUserId, location.state]);

    const setupWebSocket = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        const userQueue = `/user/${authenticatedUserId}/queue/request-response`;

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                setIsConnected(true);

                subscriptionRef.current = websocketServices.subscribe(
                    userQueue,
                    handleRequestResponse
                );
            },
            onDisconnect: () => {
                setIsConnected(false);
                subscriptionRef.current = null;
            },
            onError: (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
                subscriptionRef.current = null;
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            withCredentials: true
        });
    };

    const cleanupWebSocket = () => {
        if (subscriptionRef.current) {
            try {
                subscriptionRef.current.unsubscribe();
            } catch (error) {
                console.error('Error during unsubscribe:', error);
            }
            subscriptionRef.current = null;
        }
        setIsConnected(false);
    };

    const handleRequestResponse = (response) => {
        if (currentUserIdRef.current !== authenticatedUserId) {
            return;
        }

        setNotification(response);

        if (response.apartmentNumber !== undefined) {
            if (response.message && response.message.includes("accepted")) {
                setTimeout(() => {
                    navigate("/resident-page");
                }, 3000);
            } else if (response.message && response.message.includes("rejected")) {
                setTimeout(() => {
                    navigate("/choose-role");
                }, 3000);
            }
        }

        if (response.companyName) {
            if (response.message && response.message.includes("rejected")) {
                setTimeout(() => {
                    navigate("/choose-role");
                }, 3000);
            }
        }
    };

    const handleLogout = async () => {
        try {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            websocketServices.disconnect();

            await apiServices.post(LOGOUT_URL);
            localStorage.removeItem("authenticatedUserId");
            localStorage.removeItem("authenticatedUserName");

            navigate("/");
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    }

    const handleCloseNotification = () => {
        setNotification(null);

        if (notification?.message?.includes("accepted")) {
            navigate("/resident-dashboard");
        } else {
            navigate("/choose-role");
        }
    };

    const getAllBuildings = async() => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
        } catch (error) {
            console.error('Error fetching buildings:', error.message);
        }
    }

    const getAvailableApartmentsInBuilding = async(buildingId, page = 0) => {
        if (requestSent) return;

        setLoadingApartments(true);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_AVAILABLE_APARTMENTS_URL}/${buildingId}?${params.toString()}`;
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

        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const handlePageChange = (newPage) => {
        if (selectedBuilding && newPage >= 0 && newPage < totalPages && !requestSent) {
            getAvailableApartmentsInBuilding(selectedBuilding.id, newPage);
        }
    };

    const handleSelectApartment = (apartment) => {
        if (selectedApartmentId || requestSent) return;

        setSelectedApartmentId(apartment.id);
        setRequestSent(true);

        const responseData = {
            buildingId: selectedBuilding?.id,
            buildingNumber: selectedBuilding?.buildingNumber,
            requestedApartmentId: apartment.id
        }

        const success = websocketServices.sendMessage(
            SEND_APARTMENT_REQUEST,
            responseData
        );

        if (success){
            setShowPendingView(true);
        } else {
            console.error('Failed to send apartment request');
            setSelectedApartmentId(null);
            setRequestSent(false);
        }
    };

    const renderNotificationContent = () => {
        if (!notification) return null;

        if (notification.apartmentNumber !== undefined) {
            return (
                <>
                    <h3>Apartment Request Update!</h3>
                    <p>{notification.message}</p>
                    <p><strong>Building:</strong> {notification.buildingNumber}</p>
                    <p><strong>Apartment:</strong> {notification.apartmentNumber}</p>
                    <button onClick={handleCloseNotification}>
                        {notification.message.includes("accepted") ? "Go to Resident Dashboard" : "Back to Role Selection"}
                    </button>
                </>
            );
        }

        return null;
    };

    const isApartmentDisabled = (apartmentId) => {
        return (selectedApartmentId !== null && selectedApartmentId !== apartmentId) || requestSent;
    }

    if (showPendingView) {
        return (
            <div className="pending-page">
                {notification && (
                    <div className="resident-request-notification-modal">
                        <div className="resident-request-notification-content">
                            {renderNotificationContent()}
                        </div>
                    </div>
                )}

                <div className="pending-container">
                    <div className="pending-content">
                        <h1 className="pending-title">Request Pending</h1>
                        <p className="pending-text">
                            Your request for an apartment is currently <strong>PENDING</strong> and is being
                            reviewed by an administrator.
                        </p>
                        <div className="pending-loader">
                            <div className="loader-dot"></div>
                            <div className="loader-dot"></div>
                            <div className="loader-dot"></div>
                        </div>
                        <p className="pending-hint">
                            You will be automatically notified when there's an update.
                            Feel free to leave this page and check back later.
                        </p>
                        <button
                            onClick={handleLogout}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            LOG OUT
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="resident-request-container-resident">
            {notification && (
                <div className="resident-request-notification-modal">
                    <div className="resident-request-notification-content">
                        {renderNotificationContent()}
                    </div>
                </div>
            )}

            <div className={`left-section-resident ${requestSent ? 'left-section-disabled-resident' : ''}`}>
                <div className="left-section-header-resident">
                    <h2 className="section-title-resident">Choose where you will live</h2>
                    <p className="section-subtitle-resident">Select a building from the list below</p>
                </div>

                {requestSent && (
                    <div className="resident-request-waiting-message-left">
                        <div className="resident-request-waiting-icon">⏳</div>
                        <p>Request submitted - waiting for admin approval</p>
                    </div>
                )}

                {buildings && buildings.length > 0 ? (
                    <BuildingsList
                        buildings={buildings}
                        getApartments={getAvailableApartmentsInBuilding}
                        selectedBuilding={selectedBuilding}
                        disabled={requestSent}
                    />
                ) : (
                    <div className="no-buildings-message-resident">
                        <p>No buildings available in the system</p>
                    </div>
                )}
            </div>

            <div className="middle-section-resident">
                {selectedBuilding ? (
                    <div className="building-details-resident">
                        <h2 className="building-name-resident">{selectedBuilding.name}</h2>
                        <div className="building-info-resident">
                            <p><strong>Address:</strong> {selectedBuilding.address || 'N/A'}</p>
                        </div>

                        <div className="apartments-section-resident">
                            <div className="apartments-header-resident">
                                <h3 className="apartments-title-resident">Available Apartments</h3>
                                <p className="pagination-info-resident">
                                    Showing {apartments.length > 0 ? (currentPage * pageSize + 1) : 0} -{' '}
                                    {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} apartments
                                </p>
                            </div>

                            {!requestSent ? (
                                <div className="apartments-list-resident">
                                    {loadingApartments ? (
                                        <div className="loading-message-resident">Loading apartments...</div>
                                    ) : apartments && apartments.length > 0 ? (
                                        <>
                                            {apartments.map(apartment => (
                                                <div
                                                    key={apartment.id}
                                                    className={`apartment-item-resident ${
                                                        isApartmentDisabled(apartment.id) ? 'apartment-disabled-resident' : ''
                                                    } ${
                                                        selectedApartmentId === apartment.id ? 'apartment-selected-resident' : ''
                                                    }`}
                                                >
                                                    <div className="apartment-info-resident">
                                                        <h4>Apartment {apartment.apartmentNumber}</h4>
                                                        <p><strong>Floor:</strong> {apartment.floorNumber || 'N/A'}</p>
                                                        {selectedApartmentId === apartment.id && (
                                                            <div className="resident-request-selected-badge">
                                                                Selected ✓
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        className={`select-apartment-btn-resident ${
                                                            isApartmentDisabled(apartment.id) ? 'select-apartment-disabled-resident' : ''
                                                        }`}
                                                        onClick={() => handleSelectApartment(apartment)}
                                                        disabled={isApartmentDisabled(apartment.id)}
                                                    >
                                                        {selectedApartmentId === apartment.id ?
                                                            "Request Sent" :
                                                            "Select Apartment"
                                                        }
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="no-apartments-message-resident">
                                            No available apartments in this building
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="resident-request-apartments-disabled">
                                    <div className="resident-request-disabled-icon">🔒</div>
                                    <h4>Apartment Selection Locked</h4>
                                    <p>You have already submitted a request. Please wait for the administrator's decision.</p>
                                </div>
                            )}

                            {!requestSent && totalPages > 1 && (
                                <div className="pagination-resident">
                                    <button
                                        className="pagination-btn-resident"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                    >
                                        ← Previous
                                    </button>

                                    <div className="pagination-pages-resident">
                                        {currentPage >= 3 && (
                                            <>
                                                <button
                                                    className="pagination-page-resident"
                                                    onClick={() => handlePageChange(0)}
                                                >
                                                    1
                                                </button>
                                                {currentPage > 3 && <span className="pagination-ellipsis-resident">...</span>}
                                            </>
                                        )}

                                        {[...Array(totalPages)].map((_, index) => {
                                            if (index >= currentPage - 1 && index <= currentPage + 1 && index >= 0 && index < totalPages) {
                                                return (
                                                    <button
                                                        key={index}
                                                        className={`pagination-page-resident ${currentPage === index ? 'active-resident' : ''}`}
                                                        onClick={() => handlePageChange(index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}

                                        {currentPage <= totalPages - 4 && (
                                            <>
                                                {currentPage < totalPages - 4 && <span className="pagination-ellipsis-resident">...</span>}
                                                <button
                                                    className="pagination-page-resident"
                                                    onClick={() => handlePageChange(totalPages - 1)}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        className="pagination-btn-resident"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="no-selection-message-resident">
                        <p>Click on one of the buildings to view available apartments</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResidentRequest