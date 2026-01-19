import {useContext, useEffect, useState, useRef} from "react";
import {UserContext} from "../../context/general/UserContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import BuildingsList from "../admin/components/BuildingsList.jsx";
import {CompanyRequestContext} from "../../context/role-selection/CompanyRequestContext.jsx";
import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import "./styles/CompanyRequest.css"

const CompanyRequest = () => {
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL
    const SEND_COMPANY_REQUEST = import.meta.env.VITE_API_WEBSOCKET_COMPANY_REQUEST_SEND_DESTINATION;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`
    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;

    const {authenticatedUserId} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding,
        showPendingView, setShowPendingView,
        formData, setFormData,
        notification, setNotification,
        requestSent, setRequestSent,
        setIsConnected, serviceTypeOptions
    } = useContext(CompanyRequestContext);


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

            const hasActiveCompanyRequest = location.state?.hasActiveCompanyRequest;
            setShowPendingView(hasActiveCompanyRequest || false);

            currentUserIdRef.current = authenticatedUserId;
            setNotification(null);
            setRequestSent(false);
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

        // if (response.companyName) {
        //     if (response.message && response.message.includes("accepted")) {
        //         setTimeout(() => {
        //             navigate("/company-page");
        //         }, 3000);
        //     } else if (response.message && response.message.includes("rejected")) {
        //         setTimeout(() => {
        //             navigate("/choose-role");
        //         }, 3000);
        //     }
        // }
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

    const getAllBuildings = async () => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
        } catch (error) {
            console.error('Error fetching buildings:', error.message);
        }
    }

    const handleSelectBuilding = (buildingId) => {
        const building = buildings.find(b => b.id === buildingId);
        setSelectedBuilding(building);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedBuilding || requestSent) return;

        setRequestSent(true);

        const requestData = {
            buildingId: selectedBuilding.id,
            buildingNumber: selectedBuilding.buildingNumber,
            buildingAddress: selectedBuilding.address,
            companyName: formData.companyName,
            companyEmail: formData.companyEmail,
            companyPhoneNumber: formData.companyPhoneNumber,
            companyAddress: formData.companyAddress,
            companyIntroduction: formData.companyIntroduction,
            serviceType: formData.serviceType
        };

        const success = websocketServices.sendMessage(
            SEND_COMPANY_REQUEST,
            requestData
        );

        if (success) {
            setShowPendingView(true);

            setFormData({
                companyName: '',
                companyEmail: '',
                companyPhoneNumber: '',
                companyAddress: '',
                companyIntroduction: '',
                serviceType: ''
            });

        } else {
            console.error('Failed to send company request');
            setRequestSent(false);
        }
    };

    const renderNotificationContent = () => {
        if (!notification) return null;

        if (notification.companyName) {
            return (
                <>
                    <h3>Company Request Update!</h3>
                    <p>{notification.message}</p>
                    <p><strong>Company:</strong> {notification.companyName}</p>
                    <p><strong>Service Type:</strong> {notification.serviceType}</p>
                    <p>Please log out and log in again to access the company features.</p>
                    <button onClick={handleLogout}>
                        {notification.message.includes("accepted") ? "Log out" : "Back to Role Selection"}
                    </button>
                </>
            );
        }

        return null;
    };

    if (showPendingView) {
        return (
            <div className="company-request-pending-page">
                {notification && (
                    <div className="company-request-notification-modal">
                        <div className="company-request-notification-content">
                            {renderNotificationContent()}
                        </div>
                    </div>
                )}

                <div className="company-request-pending-container">
                    <div className="company-request-pending-content">
                        <h1 className="company-request-pending-title">Request Pending</h1>
                        <p className="company-request-pending-text">
                            Your company request is currently <strong>PENDING</strong> and is being
                            reviewed by an administrator.
                        </p>
                        <div className="company-request-pending-loader">
                            <div className="company-request-loader-dot"></div>
                            <div className="company-request-loader-dot"></div>
                            <div className="company-request-loader-dot"></div>
                        </div>
                        <p className="company-request-pending-hint">
                            You will be automatically notified when there's an update.
                            Feel free to leave this page and check back later.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="company-request-logout-btn"
                        >
                            LOG OUT
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="company-request-container">
            {notification && (
                <div className="company-request-notification-modal">
                    <div className="company-request-notification-content">
                        {renderNotificationContent()}
                    </div>
                </div>
            )}

            <div className={`company-request-left-section ${requestSent ? 'company-request-left-section-disabled' : ''}`}>
                <div className="company-request-left-section-header">
                    <h2 className="company-request-section-title">Choose Building to Service</h2>
                    <p className="company-request-section-subtitle">Select a building from the list below</p>
                </div>

                {requestSent && (
                    <div className="company-request-waiting-message-left">
                        <div className="company-request-waiting-icon">⏳</div>
                        <p>Request submitted - waiting for admin approval</p>
                    </div>
                )}

                {buildings && buildings.length > 0 ? (
                    <BuildingsList
                        buildings={buildings}
                        getApartments={handleSelectBuilding}
                        selectedBuilding={selectedBuilding}
                        disabled={requestSent}
                    />
                ) : (
                    <div className="company-request-no-buildings-message">
                        <p>No buildings available in the system</p>
                    </div>
                )}
            </div>

            <div className="company-request-middle-section">
                {selectedBuilding ? (
                    <div className="company-request-form-container">
                        <div className="company-request-building-details">
                            <h2 className="company-request-building-name">{selectedBuilding.name}</h2>
                            <div className="company-request-building-info">
                                <p><strong>Building Number:</strong> {selectedBuilding.buildingNumber || 'N/A'}</p>
                                <p><strong>Address:</strong> {selectedBuilding.address || 'N/A'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="company-request-form">
                            <h3 className="company-request-form-title">Company Information</h3>

                            <div className="company-request-form-group">
                                <label htmlFor="companyName">Company Name *</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                    disabled={requestSent}
                                />
                            </div>

                            <div className="company-request-form-group">
                                <label htmlFor="companyEmail">Company Email *</label>
                                <input
                                    type="email"
                                    id="companyEmail"
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleInputChange}
                                    required
                                    disabled={requestSent}
                                />
                            </div>

                            <div className="company-request-form-group">
                                <label htmlFor="companyPhoneNumber">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="companyPhoneNumber"
                                    name="companyPhoneNumber"
                                    value={formData.companyPhoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    disabled={requestSent}
                                />
                            </div>

                            <div className="company-request-form-group">
                                <label htmlFor="companyAddress">Company Address *</label>
                                <textarea
                                    id="companyAddress"
                                    name="companyAddress"
                                    value={formData.companyAddress}
                                    onChange={handleInputChange}
                                    required
                                    disabled={requestSent}
                                    rows="3"
                                />
                            </div>

                            <div className="company-request-form-group">
                                <label htmlFor="companyIntroduction">Company Introduction *</label>
                                <textarea
                                id="companyIntroduction"
                                name="companyIntroduction"
                                onChange={handleInputChange}
                                required
                                disabled={requestSent}
                                rows="3"
                                />
                            </div>

                            <div className="company-request-form-group">
                                <label htmlFor="serviceType">Service Type *</label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleInputChange}
                                    required
                                    disabled={requestSent}
                                >
                                    {serviceTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="company-request-submit-btn"
                                disabled={requestSent || !formData.companyName || !formData.companyEmail || !formData.companyPhoneNumber || !formData.companyAddress || !formData.companyIntroduction || !formData.serviceType}
                            >
                                {requestSent ? "Request Sent" : "Submit Company Request"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="company-request-no-selection-message">
                        <p>Select a building from the list to submit a company service request</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyRequest;