import {useContext, useEffect, useRef, useState} from "react";

import { FaFileAlt } from "react-icons/fa";

import { useCompanies } from "../../hooks/useCompanies.js";
import { useFeedback } from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";

import { CompanyPageContext } from "../../context/company/CompanyPageContext.jsx";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";

import websocketServices from "../../services/WebsocketServices.js";

import "./style/CompanyPage.css";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";

const CompanyPage = () => {

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const {
        usersCompany, usersFeedbacks, usersBuildings,
        authenticatedCompanyUserId,
        companyGroupIdentifier, companyId,
        privateReports
    } = useContext(CompanyPageContext);

    const {
        publicReports
    } = useContext(ResidentReportContext);

    const subscriptionRef = useRef(null);
    const removalSubscriptionRef = useRef(null);
    const notificationSubscriptionRef = useRef(null);
    const requestResponseSubscriptionRef = useRef(null);

    const [expandedReportId, setExpandedReportId] = useState(null);

    const {
        currentPage, setCurrentPage,
        totalPages
    } = useContext(PaginationContext);


    const reportTypeIcons = {
        ELECTRICITY: "⚡",
        LIGHTNING: "💡",
        WATER_SUPPLY: "💧",
        SEWAGE: "🚽",
        HEATING: "🔥",
        ELEVATOR: "🛗",
        GARBAGE_COLLECTION: "🗑️",
        SECURITY: "🔒",
        GARDENING: "🌳",
        OTHER: "📋"
    };

    console.log("NEEDED LOG")
    console.log(privateReports);
    console.log("NEEDED LOG");

    const truncateText = (text, maxLength = 100) => {
        if (text && text.length <= maxLength) return text;
        return text ? text.substr(0, maxLength) + '...' : '';
    };

    const toggleReportExpansion = (index) => {
        setExpandedReportId(expandedReportId === index ? null : index);
    };

    const handleReportsPageChange = (newPage) => {
        setCurrentPage(newPage);
        getAllPublicReports(newPage);
    };

    const { getMyCompany } = useCompanies();
    const { getFeedbacksForCompany } = useFeedback();
    const { getBuildingsByCompanyId } = useBuildings();
    const { getAllPublicReports, getPrivateReportsForCompany, acceptReport} = useReports()

    useEffect(() => {
        getMyCompany();
        getAllPublicReports(0);
        getPrivateReportsForCompany(0,companyId)
    }, []);

    useEffect(() => {
        if (usersCompany?.id) {
            getFeedbacksForCompany(usersCompany.id);
            getBuildingsByCompanyId(usersCompany.id);
        }
    }, [usersCompany?.id]);

    useEffect(() => {
        if (!companyGroupIdentifier || !authenticatedCompanyUserId) {
            console.log("⚠️ Missing group or user info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Company WebSocket connected successfully");

                const groupTopic = `/topic/group/${companyGroupIdentifier}`;
                subscriptionRef.current = websocketServices.subscribe(
                    groupTopic,
                    (message) => {
                        console.log("📬 Received on group topic:", message);
                    }
                );

                const requestResponseQueue = `/user/${authenticatedCompanyUserId}/queue/request-response`;
                requestResponseSubscriptionRef.current = websocketServices.subscribe(
                    requestResponseQueue,
                    (message) => {
                        console.log("📬 Company request response:", message);
                    }
                );

                const removalQueue = `/user/${authenticatedCompanyUserId}/queue/removal`;
                removalSubscriptionRef.current = websocketServices.subscribe(
                    removalQueue,
                    (message) => {
                        console.log("📬 Company removal notification:", message);
                    }
                );

                const notificationQueue = `/user/${companyId}/queue/notification`;
                notificationSubscriptionRef.current = websocketServices.subscribe(
                    notificationQueue,
                    (message) => {
                        console.log("📬 Company notification:", message);
                        // handleNotification(message);
                    }
                );
            },
        });

        return () => {
            [subscriptionRef, requestResponseSubscriptionRef, removalSubscriptionRef, notificationSubscriptionRef]
                .forEach(ref => {
                    if (ref.current) {
                        ref.current.unsubscribe();
                        ref.current = null;
                    }
                });
            websocketServices.disconnect();
        };
    }, [companyGroupIdentifier, authenticatedCompanyUserId]);

    if (!usersCompany) {
        return <p>Loading...</p>;
    }

    return (
        <div className="company-page-container">
            <div className="company-page-info-section">
                <h2 className="company-page-company-name">{usersCompany.name}</h2>
                <div className="company-page-info-grid">
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Company ID:</span>
                        <span className="company-page-info-value">{usersCompany.id}</span>
                    </div>
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Email:</span>
                        <span className="company-page-info-value">{usersCompany.email}</span>
                    </div>
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Address:</span>
                        <span className="company-page-info-value">{usersCompany.address}</span>
                    </div>
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Phone:</span>
                        <span className="company-page-info-value">{usersCompany.phoneNumber}</span>
                    </div>
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Service Type:</span>
                        <span className="company-page-info-value">{usersCompany.serviceType}</span>
                    </div>
                    <div className="company-page-info-item">
                        <span className="company-page-info-label">Rating:</span>
                        <span className="company-page-info-value">{usersCompany.overallRating}</span>
                    </div>
                </div>
                <div className="company-page-description">
                    <h3>About Us</h3>
                    <p>{usersCompany.companyIntroduction}</p>
                </div>
            </div>

            {/* Public Reports Section */}
            <div className="company-page-reports-section">
                <div className="company-page-reports-card">
                    <div className="company-page-card-header">
                        <FaFileAlt className="company-page-card-icon" />
                        <h3>Public Reports</h3>
                    </div>

                    {publicReports && publicReports.length > 0 ? (
                        <div>
                            <div className="company-page-reports-list">
                                {publicReports.map((report, index) => (
                                    <div
                                        key={index}
                                        className={`company-page-report-item ${expandedReportId === index ? 'company-page-report-expanded' : ''}`}
                                        onClick={() => toggleReportExpansion(index)}
                                    >
                                        <div className="company-page-report-header">
                                        <span className="company-page-report-type-icon">
                                            {reportTypeIcons[report.reportType] || "📋"}
                                        </span>
                                            <div className="company-page-report-title">
                                                <h4>{report.name}</h4>
                                                <span className="company-page-report-meta">
                                                By {report.senderName} • {report.reportType}
                                            </span>
                                            </div>
                                            <span className="company-page-expand-icon">
                                            {expandedReportId === index ? '−' : '+'}
                                        </span>
                                        </div>

                                        <div className="company-page-report-details">
                                            <p className="company-page-report-description">
                                                {expandedReportId === index
                                                    ? report.issueDescription
                                                    : truncateText(report.issueDescription, 80)}
                                            </p>

                                            {expandedReportId === index && report.comment && (
                                                <div className="company-page-report-comment">
                                                    <strong>Additional Comments:</strong>
                                                    <p>{report.comment}</p>
                                                </div>
                                            )}

                                            <div className="company-page-report-footer">
                                                {report.roomNumber && (
                                                    <span className="company-page-footer-tag">
                                                    Room: {report.roomNumber}
                                                </span>
                                                )}
                                                {report.floor && (
                                                    <span className="company-page-footer-tag">
                                                    Floor: {report.floor}
                                                </span>
                                                )}
                                                <span className="company-page-report-date">
                                                {report.createdAt
                                                    ? new Date(report.createdAt).toLocaleString()
                                                    : "Recently"}
                                            </span>
                                                <button onClick={()=> acceptReport( report.reportId, companyId)}>Accept Report</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="company-page-pagination">
                                    <button
                                        className="company-page-pagination-btn company-page-pagination-prev"
                                        onClick={() => handleReportsPageChange(currentPage - 1)}
                                        disabled={currentPage=== 0}
                                    >
                                        Previous
                                    </button>

                                    <div className="company-page-page-numbers">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i;
                                            } else if (currentPage <= 2) {
                                                pageNum = i;
                                            } else if (currentPage >= totalPages - 3) {
                                                pageNum = totalPages - 5 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`company-page-page-number ${currentPage === pageNum ? 'company-page-page-active' : ''}`}
                                                    onClick={() => handleReportsPageChange(pageNum)}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="company-page-pagination-btn company-page-pagination-next"
                                        onClick={() => handleReportsPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="company-page-empty-state">
                            <FaFileAlt className="company-page-empty-icon" />
                            <p>No public reports available</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="company-page-feedbacks-section">
                <h3>Customer Feedbacks</h3>
                {usersFeedbacks && usersFeedbacks.length > 0 ? (
                    <div className="company-page-feedbacks-list">
                        {usersFeedbacks.map(feedback => (
                            <div key={feedback.id} className="company-page-feedback-item">
                                <div className="company-page-feedback-header">
                                    <span className="company-page-feedback-rating">⭐ {feedback.rating}/5</span>
                                    <span className="company-page-feedback-date">{feedback.createdAt}</span>
                                </div>
                                <p className="company-page-feedback-message">{feedback.message}</p>
                                <div className="company-page-feedback-footer">
                                    <span className="company-page-feedback-author">By: {feedback.reviewerEmail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="company-page-no-feedback">No feedbacks yet</p>
                )}
            </div>


            <div className="company-page-buildings-section">
                <h3>Managed Buildings</h3>
                {usersBuildings && usersBuildings.length > 0 ? (
                    <div className="company-page-buildings-list">
                        {usersBuildings.map(building => (
                            <div key={building.id} className="company-page-building-item">
                                <h4 className="company-page-building-title">Building #{building.buildingNumber}</h4>
                                <p className="company-page-building-address">{building.address}</p>
                                <div className="company-page-building-info">
                                <span className="company-page-building-apartments">
                                    Apartments: {building.numberOfApartments}
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="company-page-no-buildings">No buildings managed</p>
                )}
            </div>
        </div>
    );

};

export default CompanyPage;
