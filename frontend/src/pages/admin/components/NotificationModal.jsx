import {FaBuilding} from "react-icons/fa6";

import {getServiceIcon} from "../../../utility/GetCompanyLogoUtility.jsx";
import {getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";

import "./component-styles/NotificationModal.css"

const NotificationModal = ({ setIsAdminModalOpen, apartmentRequests,
                               companyRequests, handleAcceptApartmentRequest,
                               handleRejectApartmentRequest, handleAcceptCompanyRequest,
                               handleRejectCompanyRequest,
}) => {

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsAdminModalOpen(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        } catch {
            return "Invalid date";
        }
    };


    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="notification-modal">
                <div className="modal-header">
                    <h2>Notifications</h2>
                    <button
                        className="close-button"
                        onClick={() => setIsAdminModalOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    <div className="notification-section">
                        <h3>Pending Apartment Requests</h3>
                        <div className="notification-list">
                            {apartmentRequests && apartmentRequests.length > 0 ? (
                                apartmentRequests.map((request) => (
                                    <div
                                        key={request.requestId}
                                        className="notification-item real-notification"
                                    >
                                        <div className="notification-icon"><FaBuilding/></div>
                                        <div className="notification-text">
                                            <div className="notification-header">
                                                <p className="notification-title">
                                                    New Apartment Request #{request.requestId}
                                                </p>
                                                <span className="status-badge">
                          {request.status || "PENDING"}
                        </span>
                                            </div>

                                            <p className="notification-description">
                                                <strong>Requester name:  </strong> {request.requesterName}
                                                <br />
                                                <strong>Building address: </strong> {request.buildingAddress}
                                                <br />
                                                <strong>Apartment number:  </strong> {request.apartmentNumber}
                                                <br/>
                                                <strong>Type:</strong> Apartment Registration
                                            </p>

                                            <span className="notification-time">
                        Submitted: {formatDate(request.createdAt)}
                      </span>

                                            <div className="notification-actions">
                                                <button
                                                    className="accept-btn"
                                                    onClick={() => handleAcceptApartmentRequest(request.requestId)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleRejectApartmentRequest(request.requestId)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-requests">
                                    <div className="notification-icon">📭</div>
                                    <p>No pending apartment requests</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="notification-section">
                        <h3>Pending Company Requests</h3>
                        <div className="notification-list">
                            {companyRequests && companyRequests.length > 0 ? (
                                companyRequests.map((request) => (
                                    <div
                                        key={request.requestId}
                                        className={`notification-item real-notification company-request ${request.serviceType?.toLowerCase()}-request`}
                                    >
                                        <div className="notification-icon service-type-icon">
                                            {getServiceIcon(request.serviceType)}
                                        </div>
                                        <div className="notification-text">
                                            <div className="notification-header">
                                                <p className="notification-title">
                                                    New company request #{request.requestId}
                                                </p>
                                                <span className="status-badge">
                          {request.status || "PENDING"}
                        </span>
                                            </div>

                                            <p className="notification-description">
                                                <strong>Company Name: </strong> {request.name}
                                                <br />
                                                <strong>Service Type: </strong>
                                                <span className="service-type-badge">
                                                    {getServiceTypeDisplay(request.serviceType)}
                                                </span>
                                                <br />
                                                <strong>Contact: </strong> {request.email} | {request.phoneNumber}
                                                <br />
                                                <strong>Address: </strong> {request.address}
                                                <br />
                                                <strong>Type:</strong> Company Registration
                                            </p>

                                            <span className="notification-time">
                        Submitted: {formatDate(request.createdAt)}
                      </span>

                                            <div className="notification-actions">
                                                <button
                                                    className="accept-btn"
                                                    onClick={() => handleAcceptCompanyRequest(request.requestId)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleRejectCompanyRequest(request.requestId)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-requests">
                                    <div className="notification-icon">🏢</div>
                                    <p>No pending company requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;