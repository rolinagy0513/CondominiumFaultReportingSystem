import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import { FaFileAlt } from "react-icons/fa";
import {IoLogOut} from "react-icons/io5";

import { useCompanies } from "../../hooks/useCompanies.js";
import { useFeedback } from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";

import {getServiceTypeDisplay} from "../../utility/GetCompanyLogoUtility.jsx";

import { CompanyPageContext } from "../../context/company/CompanyPageContext.jsx";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";

import websocketServices from "../../services/WebsocketServices.js";
import apiServices from "../../services/ApiServices.js";

import "./style/CompanyPage.css"

const CompanyPage = () => {

    const navigate = useNavigate();

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        usersCompany, usersFeedbacks, usersBuildings,
        authenticatedCompanyUserId,
        companyGroupIdentifier, companyId,
        privateReports, acceptedReports
    } = useContext(CompanyPageContext);

    const {
        publicReports
    } = useContext(ResidentReportContext);

    const subscriptionRef = useRef(null);
    const removalSubscriptionRef = useRef(null);
    const notificationSubscriptionRef = useRef(null);
    const requestResponseSubscriptionRef = useRef(null);

    const [expandedReportId, setExpandedReportId] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('public');

    const {
        currentPage, setCurrentPage,
        totalPages, currentPrivatePage,
        setCurrentPrivatePage, totalPrivatePage,
        setTotalPages, setTotalPrivatePage
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

    const truncateText = (text, maxLength = 100) => {
        if (text && text.length <= maxLength) return text;
        return text ? text.substr(0, maxLength) + '...' : '';
    };

    const toggleReportExpansion = (index) => {
        setExpandedReportId(expandedReportId === index ? null : index);
    };

    const handlePublicReportsPageChange = (newPage) => {
        setCurrentPage(newPage);
        getAllPublicReports(newPage);
    };

    const handlePrivateReportsPageChange = (newPage) => {
        setCurrentPrivatePage(newPage);
        getPrivateReportsForCompany(newPage, companyId);
    };

    const {
        getMyCompany
    } = useCompanies();

    const {
        getFeedbacksForCompany
    } = useFeedback();

    const {
        getBuildingsByCompanyId
    } = useBuildings();

    const {
        getAllPublicReports, getPrivateReportsForCompany,
        acceptReport, getAcceptedReportsForCompany,
        completeReport,
    } = useReports()

    useEffect(() => {
        getMyCompany();
        getAllPublicReports(0);
        getPrivateReportsForCompany(0, companyId);
        getAcceptedReportsForCompany(companyId);
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

    // Determine which data to show based on active tab
    const currentReports = activeReportTab === 'public' ? publicReports : privateReports;
    const currentPageNum = activeReportTab === 'public' ? currentPage : currentPrivatePage;
    const currentTotalPages = activeReportTab === 'public' ? totalPages : totalPrivatePage;
    const handlePageChange = activeReportTab === 'public' ? handlePublicReportsPageChange : handlePrivateReportsPageChange;

    const renderPagination = () => {
        if (currentTotalPages <= 1) return null;

        return (
            <div className="company-page-pagination-container">
                <div className="company-page-pagination">
                    <button
                        className="company-page-pagination-btn company-page-pagination-prev"
                        onClick={() => handlePageChange(currentPageNum - 1)}
                        disabled={currentPageNum === 0}
                    >
                        Previous
                    </button>

                    <div className="company-page-page-numbers">
                        {Array.from({ length: Math.min(5, currentTotalPages) }, (_, i) => {
                            let pageNum;
                            if (currentTotalPages <= 5) {
                                pageNum = i;
                            } else if (currentPageNum <= 2) {
                                pageNum = i;
                            } else if (currentPageNum >= currentTotalPages - 3) {
                                pageNum = currentTotalPages - 5 + i;
                            } else {
                                pageNum = currentPageNum - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`company-page-page-number ${currentPageNum === pageNum ? 'company-page-page-active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="company-page-pagination-btn company-page-pagination-next"
                        onClick={() => handlePageChange(currentPageNum + 1)}
                        disabled={currentPageNum === currentTotalPages - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };


    const handleLogout = async () => {
        try {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (removalSubscriptionRef.current) {
                removalSubscriptionRef.current.unsubscribe();
                removalSubscriptionRef.current = null;
            }
            if (notificationSubscriptionRef.current) {
                notificationSubscriptionRef.current.unsubscribe();
                notificationSubscriptionRef.current = null;
            }

            websocketServices.disconnect();

            await apiServices.post(LOGOUT_URL);

            localStorage.removeItem("authenticatedCompanyUserId");
            localStorage.removeItem("companyId");
            localStorage.removeItem("authenticatedCompanyUserName");
            localStorage.removeItem("companyGroupId");
            localStorage.removeItem("authenticatedCompanyGroupIdentifier");

            navigate("/");

        } catch (error) {
            console.error(error.message);
        }
    };

    const renderReportsList = (reports) => {
        if (!reports || reports.length === 0) {
            return (
                <div className="company-page-empty-state">
                    <FaFileAlt className="company-page-empty-icon" />
                    <p>No {activeReportTab} reports available</p>
                </div>
            );
        }


        return (
            <>
                <div className="company-page-reports-list">
                    {reports.map((report, index) => (
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
                                    <button
                                        className="company-page-accept-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            acceptReport(report.reportId, companyId);
                                        }}
                                    >
                                        Accept Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {renderPagination()}
            </>
        );
    };

    return (
        <div className="company-page-container">
            {/* Header */}
            <header className="company-page-header">
                {/* Left side - Company Name */}
                <div className="company-page-header-left">
                    <h2>Company Dashboard</h2>
                    <p className="company-page-company-tagline"> Welcome back, {usersCompany.name}</p>
                </div>

                {/* Middle - Dashboard Title */}
                <div className="company-page-header-middle">
                    <h1 className="company-page-title">
                        HomeLink
                        <span className="company-page-title-icon">🏢</span>
                    </h1>
                </div>

                {/* Right side - Actions */}
                <div className="company-page-header-right">
                    <button className="company-page-header-action-btn company-page-logout-btn" onClick={handleLogout}>
                        <span className="company-page-header-icon"></span>
                        Logout  <IoLogOut className="resident-page-header-icon" />
                    </button>
                </div>
            </header>

            <div className="company-page-layout">
                {/* Left Sidebar */}
                <div className="company-page-left-sidebar">
                    {/* Company Info Section */}
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
                                <span className="company-page-info-value">{getServiceTypeDisplay(usersCompany.serviceType)}</span>
                            </div>
                            <div className="company-page-info-item">
                                <span className="company-page-info-label">Overall Rating:</span>
                                <span className="company-page-info-value">{usersCompany.overallRating}⭐</span>
                            </div>
                        </div>
                        <div className="company-page-description">
                            <h3>About Us</h3>
                            <p>{usersCompany.companyIntroduction}</p>
                        </div>
                    </div>

                    {/* Feedbacks Section */}
                    <div className="company-page-feedbacks-section">
                        <h3>Customer Feedbacks</h3>
                        {usersFeedbacks && usersFeedbacks.length > 0 ? (
                            <div className="company-page-feedbacks-list">
                                {usersFeedbacks.map(feedback => (
                                    <div key={feedback.id} className="company-page-feedback-item">
                                        <div className="company-page-feedback-header">
                                            <span className="company-page-feedback-rating">⭐ {feedback.rating}/5</span>
                                            {/*<span className="company-page-feedback-date">{feedback.createdAt}</span>*/}
                                            <span className="company-page-feedback-date">
                                              {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric'
                                              }) : 'N/A'}
                                            </span>
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
                </div>

                {/* Middle Section - Reports */}
                <div className="company-page-middle-section">
                    <div className="company-page-reports-section">
                        <div className="company-page-reports-card">
                            <div className="company-page-card-header">
                                <FaFileAlt className="company-page-card-icon" />
                                <h3>Reports</h3>
                            </div>

                            {/* Report Type Tabs */}
                            <div className="company-page-report-tabs">
                                <button
                                    className={`company-page-tab-btn ${activeReportTab === 'public' ? 'company-page-tab-active' : ''}`}
                                    onClick={() => setActiveReportTab('public')}
                                >
                                    Public Reports in the Building
                                </button>
                                <button
                                    className={`company-page-tab-btn ${activeReportTab === 'private' ? 'company-page-tab-active' : ''}`}
                                    onClick={() => setActiveReportTab('private')}
                                >
                                    My Private Reports
                                </button>
                            </div>

                            {/* Reports Content Area */}
                            <div className="company-page-reports-content">
                                {renderReportsList(currentReports)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Accepted Reports & Buildings */}
                <div className="company-page-right-sidebar">
                    {/* Accepted Reports Section */}
                    <div className="company-page-accepted-reports-section">
                        <div className="company-page-accepted-reports-card">
                            <div className="company-page-card-header">
                                <FaFileAlt className="company-page-card-icon" />
                                <h3>Accepted Reports</h3>
                            </div>

                            <div className="company-page-accepted-reports-content">
                                {acceptedReports.map((report, index) => (
                                    <div key={index} className="company-page-accepted-report-item">
                                        <div className="company-page-accepted-report-header">
                                              <span className="company-page-report-type-icon">
                                                {reportTypeIcons[report.reportType] || "📋"}
                                              </span>
                                                <h4 className="company-page-accepted-report-title">{report.name}</h4>
                                        </div>

                                        <div className="company-page-accepted-report-meta">
                                              <span className="company-page-accepted-report-type">
                                                <span className="company-page-accepted-report-type-icon">
                                                  {reportTypeIcons[report.reportType] || "📋"}
                                                </span>
                                                  {report.reportType}
                                                </span>
                                            <p className="company-page-accepted-report-description">
                                                {truncateText(report.issueDescription, 60)}
                                            </p>
                                        </div>

                                        <div className="company-page-accepted-report-footer">
                                            <div>
                                                <span className="company-page-footer-tag">
                                                  By {report.senderName}
                                                </span>
                                            </div>

                                            <span className="company-page-accepted-report-date">
                                                {report.createdAt
                                                    ? new Date(report.createdAt).toLocaleDateString()
                                                    : "Recently"}
                                            </span>

                                            <button
                                                className="company-page-complete-btn"
                                                onClick={() => completeReport(report.reportId, companyId, 10)}
                                            >
                                                Complete Report
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Buildings Section */}
                    <div className="company-page-buildings-section">
                        <div className="company-page-buildings-card">
                            <h3>Managed Buildings</h3>
                            <div className="company-page-buildings-content">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;