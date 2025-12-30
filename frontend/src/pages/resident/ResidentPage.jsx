import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import {ResidentPageContext} from "../../context/resident/ResidentPageContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";

import {useApartments} from "../../hooks/useApartments.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useCompanies} from "../../hooks/useCompanies.js";
import {useReports} from "../../hooks/useReports.js";

import { IoLogOut } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";

import "./style/ResidentPage.css"
import {getServiceIcon} from "../../utility/GetCompanyLogoUtility.jsx";

const ResidentPage = () => {

    const navigate = useNavigate();

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        ownersApartment, residentGroupId,
        authenticatedResidentId, authenticatedResidentUserName,
        ownersApartmentId, ownersBuilding, ownersBuildingId,
        companiesInBuilding, publicReports
    } = useContext(ResidentPageContext);

    const {
        currentPage, setCurrentPage,
        totalPages
    } = useContext(PaginationContext);

    const {
        handleGetApartmentByOwnerId
    } = useApartments();

    const{
        getBuildingByApartmentId
    } = useBuildings()

    const{
        getCompanyByBuildingId
    } = useCompanies()

    const {
        getAllPublicReports
    } = useReports()

    console.log(ownersApartmentId)
    console.log(residentGroupId, authenticatedResidentId, authenticatedResidentUserName)

    console.log(ownersBuilding)

    const subscriptionRefs = useRef({
        requestResponse: null,
        removal: null,
        notification: null,
        groupTopic: null
    });

    useEffect(() => {
        handleGetApartmentByOwnerId();
        getAllPublicReports(0); // Start from page 0
    }, []);

    useEffect(() => {
        if (ownersApartmentId) {
            getBuildingByApartmentId(ownersApartmentId);
        }
    }, [ownersApartmentId]);

    useEffect(() =>{
        if (ownersBuildingId){
            getCompanyByBuildingId(ownersBuildingId);
        }
    },[ownersBuildingId])

    useEffect(() => {

        if (!authenticatedResidentId || !residentGroupId) {
            console.log("⚠️ Missing authentication or group info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Resident WebSocket connected successfully");

                const userQueues = [
                    { key: 'requestResponse', path: '/user/queue/request-response' },
                    { key: 'removal', path: '/user/queue/removal' },
                    { key: 'notification', path: '/user/queue/notification' }
                ];

                userQueues.forEach(({ key, path }) => {
                    subscriptionRefs.current[key] = websocketServices.subscribe(
                        path,
                        handleNotification
                    );

                    if (subscriptionRefs.current[key]) {
                        console.log(`✅ Successfully subscribed to user queue: ${path}`);
                    } else {
                        console.error(`❌ Failed to subscribe to user queue: ${path}`);
                    }
                });

                const groupTopic = `/topic/group/${residentGroupId}`;
                subscriptionRefs.current.groupTopic = websocketServices.subscribe(
                    groupTopic,
                    handleNotification
                );

                if (subscriptionRefs.current.groupTopic) {
                    console.log(`✅ Successfully subscribed to group topic: ${groupTopic}`);
                } else {
                    console.error(`❌ Failed to subscribe to group topic: ${groupTopic}`);
                }
            },
            onDisconnect: () => {
                console.log("🔌 Resident WebSocket disconnected");
                Object.keys(subscriptionRefs.current).forEach(key => {
                    subscriptionRefs.current[key] = null;
                });
            },
            onError: (error) => {
                console.error("❌ WebSocket error:", error);
                Object.keys(subscriptionRefs.current).forEach(key => {
                    subscriptionRefs.current[key] = null;
                });
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            withCredentials: true
        });

        return () => {
            console.log("🧹 Cleaning up Resident WebSocket subscriptions...");

            Object.keys(subscriptionRefs.current).forEach(key => {
                if (subscriptionRefs.current[key]) {
                    subscriptionRefs.current[key].unsubscribe();
                    subscriptionRefs.current[key] = null;
                }
            });

            websocketServices.disconnect();
        };
    }, [authenticatedResidentId, residentGroupId]);

    const handleReportsPageChange = (newPage) => {
        setCurrentPage(newPage);
        getAllPublicReports(newPage);
    };

    const handleNotification = (notification) => {
        console.log("📬 Resident received notification:", notification);
    };

    const handleLogout = async () => {
        try {
            Object.keys(subscriptionRefs.current).forEach(key => {
                if (subscriptionRefs.current[key]) {
                    subscriptionRefs.current[key].unsubscribe();
                    subscriptionRefs.current[key] = null;
                }
            });

            websocketServices.disconnect();

            await apiServices.post(LOGOUT_URL);
            localStorage.removeItem("residentGroupId");
            localStorage.removeItem("authenticatedResidentId");
            localStorage.removeItem("authenticatedResidentUserName");

            navigate("/");

        } catch (error) {
            console.error(error.message);
        }
    };

    console.log(`This is the owners apartments id: ${ownersApartment?.id}`);
    console.log(`This is the owners apartments number: ${ownersApartment?.apartmentNumber}`)

    console.log("These are the public reports: ")
    console.log(publicReports);

    return(
        <div className="resident-page">
            <div className="resident-header">
                <h2>Resident Dashboard</h2>
                <div className="resident-header-buttons">
                    <button className="resident-header-button">Notifications<IoMdNotifications/></button>
                    <button className="resident-header-button" onClick={handleLogout}>Logout<IoLogOut/></button>
                </div>
            </div>

            <div className="resident-main-content">
                <div className="resident-primary-content">
                    <div className="residentPage-apartment-info">
                        <h2>Apartment Information</h2>

                        {ownersApartment ? (
                            <div>
                                <p><strong>Apartment Number:</strong> {ownersApartment.apartmentNumber}</p>
                                <p><strong>Owner name</strong>{ownersApartment.ownerName}</p>
                                <p><strong>Floor:</strong> {ownersApartment.floorNumber}</p>
                            </div>
                        ) : (
                            <p>Loading apartment information...</p>
                        )}
                    </div>

                    {/* Building Info - Center Top */}
                    <div className="residentPage-building-info">
                        <h2>Building Information</h2>

                        {ownersBuilding ? (
                            <div>
                                <p><strong>Building Number:</strong> {ownersBuilding.buildingNumber}</p>
                                <p><strong>Building Address:</strong> {ownersBuilding.address}</p>
                                <p><strong>Number of apartments in the building:</strong>{ownersBuilding.numberOfApartments}</p>
                            </div>
                        ) : (
                            <p>Loading building information...</p>
                        )}
                    </div>

                    {/* Reports Section - Below Building Info */}
                    <div className="residentPage-reports-section">
                        <h2>Public Reports</h2>

                        {publicReports && publicReports.length > 0 ? (
                            <div className="residentPage-reports-list">
                                {publicReports.map((report, index) => (
                                    <div key={index} className="residentPage-report-card">
                                        <h3>{report.name}</h3>
                                        <p><strong>Sender:</strong> {report.senderName}</p>
                                        <p><strong>Report Type:</strong> {report.reportType}</p>
                                        <p><strong>Issue Description:</strong> {report.issueDescription}</p>
                                        {report.comment && (
                                            <p><strong>Comment:</strong> {report.comment}</p>
                                        )}
                                        {report.roomNumber && (
                                            <p><strong>Room Number:</strong> {report.roomNumber}</p>
                                        )}
                                        {report.floor && (
                                            <p><strong>Floor:</strong> {report.floor}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No public reports available</p>
                        )}

                        {totalPages > 1 && (
                            <div className="residentPage-pagination">
                                <button
                                    className="residentPage-pagination-btn"
                                    onClick={() => handleReportsPageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    ← Previous
                                </button>

                                <div className="residentPage-pagination-pages">
                                    {currentPage >= 3 && (
                                        <>
                                            <button
                                                className="residentPage-pagination-page"
                                                onClick={() => handleReportsPageChange(0)}
                                            >
                                                1
                                            </button>
                                            {currentPage > 3 && <span className="residentPage-pagination-ellipsis">...</span>}
                                        </>
                                    )}

                                    {[...Array(totalPages)].map((_, index) => {
                                        if (index >= currentPage - 1 && index <= currentPage + 1 && index >= 0 && index < totalPages) {
                                            return (
                                                <button
                                                    key={index}
                                                    className={`residentPage-pagination-page ${currentPage === index ? 'active' : ''}`}
                                                    onClick={() => handleReportsPageChange(index)}
                                                >
                                                    {index + 1}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}

                                    {currentPage <= totalPages - 4 && (
                                        <>
                                            {currentPage < totalPages - 4 && <span className="residentPage-pagination-ellipsis">...</span>}
                                            <button
                                                className="residentPage-pagination-page"
                                                onClick={() => handleReportsPageChange(totalPages - 1)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    className="residentPage-pagination-btn"
                                    onClick={() => handleReportsPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Companies Info */}
                <div className="resident-sidebar">
                    <div className="residentPage-companies-info">
                        <h2>Companies in Building</h2>

                        {companiesInBuilding && companiesInBuilding.length > 0 ? (
                            <div className="residentPage-companies-list">
                                {companiesInBuilding.map((company) => (
                                    <div key={company.id} className="residentPage-company-card">
                                        {getServiceIcon(company.serviceType)}
                                        <h3>{company.name}</h3>
                                        <p><strong>Service Type:</strong> {company.serviceType.toLowerCase()}</p>
                                        <p><strong>Email:</strong> {company.email}</p>
                                        <p><strong>Phone:</strong> {company.phoneNumber}</p>
                                        <p><strong>Address:</strong> {company.address}</p>
                                        <p><strong>Rating:</strong> {company.overallRating || 'Not rated'}</p>
                                        <p><strong>Introduction:</strong> {company.companyIntroduction || 'No introduction available'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="residentPage-companies-list">
                                <p>No companies present in the building</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentPage;