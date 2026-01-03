import {useContext, useEffect, useRef, useState} from "react";
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
import { FaBuilding, FaHome, FaFileAlt, FaChartBar, FaExclamationTriangle } from "react-icons/fa";
import { MdLocationOn, MdPeople } from "react-icons/md";

import {getServiceIcon, getServiceTypeDisplay} from "../../utility/GetCompanyLogoUtility.jsx";

import "./style/ResidentPage.css"

const ResidentPage = () => {
    const navigate = useNavigate();
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        ownersApartment, residentGroupId,
        authenticatedResidentId, authenticatedResidentUserName,
        ownersApartmentId, ownersBuilding, ownersBuildingId,
        companiesInBuilding, publicReports,inProgressReports,
    } = useContext(ResidentPageContext);

    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

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
        getAllPublicReports,
        sendPublicReport,
        sendPrivateReport,
        getInProgressReport,
    } = useReports()

    const subscriptionRefs = useRef({
        requestResponse: null,
        removal: null,
        notification: null,
        groupTopic: null
    });

    const [showReportForm, setShowReportForm] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        name: '',
        issueDescription: '',
        comment: '',
        reportType: 'ELECTRICITY'
    });

    const [showPrivateReportForm, setShowPrivateReportForm] = useState(false);

    const [privateReportFormData, setPrivateReportData] = useState({
        name: '',
        issueDescription: '',
        comment: '',
        reportType: 'ELECTRICITY'
    })

    const [expandedReportId, setExpandedReportId] = useState(null);

    const reportTypeIcons = {
        ELECTRICITY: "⚡",
        LIGHTNING: "💡",
        WATER_SUPPLY: "💧",
        SEWAGE: "🚽",
        HEATING: "🔥",
        GARBAGE_COLLECTION: "🗑️",
        SECURITY: "🔒",
        OTHER: "📋"
    };

    useEffect(() => {
        handleGetApartmentByOwnerId();
        getAllPublicReports(0);
        getInProgressReport();
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
                });

                const groupTopic = `/topic/group/${residentGroupId}`;
                subscriptionRefs.current.groupTopic = websocketServices.subscribe(
                    groupTopic,
                    handleNotification
                );
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

    const handleReportFormChange = (e) => {
        const { name, value } = e.target;
        setReportFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePrivateReportFormChange = (e) =>{
        const {name, value} = e.target;
        setPrivateReportData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmitPublicReport = async (e) => {
        e.preventDefault();
        try {
            await sendPublicReport(reportFormData);

            getAllPublicReports(currentPage);

            setReportFormData({
                name: '',
                issueDescription: '',
                comment: '',
                reportType: 'ELECTRICITY'
            });
            setShowReportForm(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    const handleSubmitPrivateReport = async (e) => {
        e.preventDefault();

        if (!selectedCompanyId) {
            alert('Please select a company first');
            return;
        }

        try {
            await sendPrivateReport(selectedCompanyId, privateReportFormData);

            setPrivateReportData({
                name: '',
                issueDescription: '',
                comment: '',
                reportType: 'ELECTRICITY'
            });
            setShowPrivateReportForm(false);
            setSelectedCompanyId(null);

            await getInProgressReport();

            alert('Private report submitted successfully!');
        } catch (error) {
            console.error('Error submitting private report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    const toggleReportExpansion = (index) => {
        setExpandedReportId(expandedReportId === index ? null : index);
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };


    return (
        <div className="resident-page">
            <div className="resident-page-header">
                <div className="resident-page-header-left">
                    <h2>Resident Dashboard</h2>
                    <p className="resident-page-welcome-text">Welcome back, {authenticatedResidentUserName || "Resident"}</p>
                </div>
                <div className="resident-page-header-right">
                    <button className="resident-page-header-action-btn resident-page-notification-btn">
                        <IoMdNotifications className="resident-page-header-icon" />
                        <span className="resident-page-notification-badge">3</span>
                    </button>
                    <button
                        className="resident-page-header-action-btn resident-page-logout-btn"
                        onClick={handleLogout}
                    >
                        <IoLogOut className="resident-page-header-icon" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="resident-page-stats-overview">
                <div className="resident-page-stat-card">
                    <div className="resident-page-stat-icon">
                        <FaHome />
                    </div>
                    <div className="resident-page-stat-info">
                        <h3>My Apartment</h3>
                        <p>{ownersApartment?.apartmentNumber || "N/A"}</p>
                    </div>
                </div>
                <div className="resident-page-stat-card">
                    <div className="resident-page-stat-icon">
                        <FaBuilding />
                    </div>
                    <div className="resident-page-stat-info">
                        <h3>Building</h3>
                        <p>{ownersBuilding?.buildingNumber || "N/A"}</p>
                    </div>
                </div>
                <div className="resident-page-stat-card">
                    <div className="resident-page-stat-icon">
                        <MdPeople />
                    </div>
                    <div className="resident-page-stat-info">
                        <h3>Service Companies</h3>
                        <p>{companiesInBuilding?.length || 0}</p>
                    </div>
                </div>
                <div className="resident-page-stat-card">
                    <div className="resident-page-stat-icon">
                        <FaChartBar />
                    </div>
                    <div className="resident-page-stat-info">
                        <h3>Active Reports</h3>
                        <p>{publicReports?.length || 0}</p>
                    </div>
                </div>
            </div>

            <div className="resident-page-main-content">
                <div className="resident-page-content-left">
                    <div className="resident-page-info-card">
                        <div className="resident-page-card-header">
                            <FaHome className="resident-page-card-icon" />
                            <h3>Apartment Information</h3>
                        </div>
                        {ownersApartment ? (
                            <div className="resident-page-info-grid">
                                <div className="resident-page-info-item">
                                    <span className="resident-page-info-label">Number</span>
                                    <span className="resident-page-info-value">{ownersApartment.apartmentNumber}</span>
                                </div>
                                <div className="resident-page-info-item">
                                    <span className="resident-page-info-label">Owner</span>
                                    <span className="resident-page-info-value">{ownersApartment.ownerName}</span>
                                </div>
                                <div className="resident-page-info-item">
                                    <span className="resident-page-info-label">Floor</span>
                                    <span className="resident-page-info-value">{ownersApartment.floorNumber}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="resident-page-loading-text">Loading apartment information...</p>
                        )}
                    </div>

                    <div className="resident-page-info-card">
                        <div className="resident-page-card-header">
                            <FaBuilding className="resident-page-card-icon" />
                            <h3>Building Information</h3>
                        </div>
                        {ownersBuilding ? (
                            <div className="resident-page-info-grid">
                                <div className="resident-page-info-item">
                                    <span className="resident-page-info-label">Building No.</span>
                                    <span className="resident-page-info-value">{ownersBuilding.buildingNumber}</span>
                                </div>
                                <div className="resident-page-info-item">
                                    <MdLocationOn className="resident-page-location-icon" />
                                    <span className="resident-page-info-label">Address</span>
                                    <span className="resident-page-info-value resident-page-address">{ownersBuilding.address}</span>
                                </div>
                                <div className="resident-page-info-item">
                                    <span className="resident-page-info-label">Apartments</span>
                                    <span className="resident-page-info-value">{ownersBuilding.numberOfApartments}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="resident-page-loading-text">Loading building information...</p>
                        )}
                    </div>
                </div>

                <div className="resident-page-content-middle">
                    <div className="resident-page-reports-card">
                        <div className="resident-page-card-header">
                            <FaFileAlt className="resident-page-card-icon" />
                            <h3>Public Reports</h3>
                            <button
                                className="resident-page-new-report-btn"
                                onClick={() => setShowReportForm(true)}
                            >
                                + New Report
                            </button>
                        </div>

                        {publicReports && publicReports.length > 0 ? (
                            <div className="resident-page-reports-list">
                                {publicReports.map((report, index) => (
                                    <div
                                        key={index}
                                        className={`resident-page-report-item ${expandedReportId === index ? 'resident-page-expanded' : ''}`}
                                        onClick={() => toggleReportExpansion(index)}
                                    >
                                        <div className="resident-page-report-header">
                                    <span className="resident-page-report-type-icon">
                                        {reportTypeIcons[report.reportType] || "📋"}
                                    </span>
                                            <div className="resident-page-report-title">
                                                <h4>{report.name}</h4>
                                                <span className="resident-page-report-meta">
                                            By {report.senderName} • {report.reportType}
                                        </span>
                                            </div>
                                            <span className="resident-page-expand-icon">
                                        {expandedReportId === index ? '−' : '+'}
                                    </span>
                                        </div>

                                        <div className="resident-page-report-details">
                                            <p className="resident-page-report-description">
                                                {expandedReportId === index
                                                    ? report.issueDescription
                                                    : truncateText(report.issueDescription, 80)}
                                            </p>

                                            {expandedReportId === index && report.comment && (
                                                <div className="resident-page-report-comment">
                                                    <strong>Additional Comments:</strong>
                                                    <p>{report.comment}</p>
                                                </div>
                                            )}

                                            <div className="resident-page-report-footer">
                                                {report.roomNumber && (
                                                    <span className="resident-page-footer-tag">
                                                Room: {report.roomNumber}
                                            </span>
                                                )}
                                                {report.floor && (
                                                    <span className="resident-page-footer-tag">
                                                Floor: {report.floor}
                                            </span>
                                                )}
                                                <span className="resident-page-report-date">
                                            {report.createdAt
                                                ? new Date(report.createdAt).toLocaleString()
                                                : "Recently"}
                                        </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="resident-page-empty-state">
                                <FaFileAlt className="resident-page-empty-icon" />
                                <p>No public reports available</p>
                                <button
                                    className="resident-page-create-first-btn"
                                    onClick={() => setShowReportForm(true)}
                                >
                                    Create First Report
                                </button>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="resident-page-pagination">
                                <button
                                    className="resident-page-pagination-btn resident-page-prev"
                                    onClick={() => handleReportsPageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </button>
                                <div className="resident-page-page-numbers">
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
                                                className={`resident-page-page-number ${currentPage === pageNum ? 'resident-page-active' : ''}`}
                                                onClick={() => handleReportsPageChange(pageNum)}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    className="resident-page-pagination-btn resident-page-next"
                                    onClick={() => handleReportsPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Companies & In Progress Reports */}
                <div className="resident-page-content-right">
                    <div className="resident-page-companies-card">
                        <div className="resident-page-card-header">
                            <h3>Service Companies</h3>
                            <span className="resident-page-company-count">
                        {companiesInBuilding?.length || 0} services
                    </span>
                        </div>

                        {companiesInBuilding && companiesInBuilding.length > 0 ? (
                            <div className="resident-page-companies-list">
                                {companiesInBuilding.map((company) => (
                                    <div key={company.id} className="resident-page-company-item">
                                        <div className="resident-page-company-header">
                                            {getServiceIcon(company.serviceType)}
                                            <div className="resident-page-company-info">
                                                <h4>{company.name}</h4>
                                                <span className="resident-page-service-badge">
                                            {company.serviceType}
                                        </span>
                                            </div>
                                        </div>
                                        <div className="resident-page-company-contact">
                                            <div className="resident-page-contact-item">
                                                <span className="resident-page-contact-label">Phone</span>
                                                <span className="resident-page-contact-value">{company.phoneNumber}</span>
                                            </div>
                                            <div className="resident-page-contact-item">
                                                <span className="resident-page-contact-label">Email</span>
                                                <span className="resident-page-contact-value resident-page-email">{company.email}</span>
                                            </div>
                                            <div className="resident-page-company-address-item">
                                                <span>Address</span>
                                                <span>{company.address}</span>
                                            </div>
                                            {company.companyIntroduction && (
                                                <div className="resident-page-company-introduction-item">
                                                    <span>Introduction</span>
                                                    <span>{company.companyIntroduction}</span>
                                                </div>
                                            )}
                                        </div>
                                        {company.overallRating && (
                                            <div className="resident-page-company-rating">
                                                <div className="resident-page-rating-stars">
                                                    {'★'.repeat(Math.floor(company.overallRating))}
                                                    {'☆'.repeat(5 - Math.floor(company.overallRating))}
                                                </div>
                                                <span className="resident-page-rating-value">
                                            {company.overallRating.toFixed(1)}
                                        </span>
                                            </div>
                                        )}
                                        <button
                                            className="resident-page-companySection-privateReport"
                                            onClick={() => {
                                                setSelectedCompanyId(company.id);
                                                setShowPrivateReportForm(true);
                                            }}
                                        >
                                            Send Private Report
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="resident-page-empty-state">
                                <p>No companies in building</p>
                            </div>
                        )}
                    </div>

                    {/* In Progress Reports Section */}
                    <div className="resident-page-inprogress-card">
                        <div className="resident-page-inprogress-header">
                            <FaExclamationTriangle className="resident-page-card-icon" />
                            <h3>In Progress Reports</h3>
                            <span className="resident-page-inprogress-count">
                        {inProgressReports?.length || 0}
                    </span>
                        </div>

                        {inProgressReports && inProgressReports.length > 0 ? (
                            <div className="resident-page-inprogress-list">
                                {inProgressReports.map((report, index) => (
                                    <div key={index} className="resident-page-inprogress-item">
                                        <div className="resident-page-inprogress-status">
                                            In Progress
                                        </div>
                                        <div className="resident-page-inprogress-title">
                                    <span className="resident-page-report-type-icon">
                                        {reportTypeIcons[report.reportType] || "📋"}
                                    </span>
                                            <h4>{report.name || "Unnamed Report"}</h4>
                                        </div>
                                        <p className="resident-page-inprogress-description">
                                            {report.issueDescription ?
                                                truncateText(report.issueDescription, 100) :
                                                "No description provided"}
                                        </p>
                                        <div className="resident-page-inprogress-footer">
                                    <span className="resident-page-inprogress-date">
                                        {report.createdAt
                                            ? new Date(report.createdAt).toLocaleDateString()
                                            : "Date unknown"}
                                    </span>
                                            {report.companyName && (
                                                <span className="resident-page-inprogress-assigned">
                                            To: {report.companyName}
                                        </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="resident-page-inprogress-empty">
                                <p>No reports in progress</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Public Report Form Modal */}
            {showReportForm && (
                <div className="resident-page-modal-overlay">
                    <div className="resident-page-modal-content">
                        <div className="resident-page-modal-header">
                            <h3>Report an Issue</h3>
                            <button
                                className="resident-page-modal-close"
                                onClick={() => setShowReportForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPublicReport} className="resident-page-report-form">
                            <div className="resident-page-form-row">
                                <div className="resident-page-form-group">
                                    <label>Report Title *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={reportFormData.name}
                                        onChange={handleReportFormChange}
                                        required
                                        placeholder="Brief description"
                                    />
                                </div>
                                <div className="resident-page-form-group">
                                    <label>Report Type *</label>
                                    <select
                                        name="reportType"
                                        value={reportFormData.reportType}
                                        onChange={handleReportFormChange}
                                        required
                                    >
                                        <option value="ELECTRICITY">⚡ Electricity</option>
                                        <option value="LIGHTNING">💡 Lighting</option>
                                        <option value="WATER_SUPPLY">💧 Water Supply</option>
                                        <option value="SEWAGE">🚽 Sewage</option>
                                        <option value="HEATING">🔥 Heating</option>
                                        <option value="GARBAGE_COLLECTION">🗑️ Garbage</option>
                                        <option value="SECURITY">🔒 Security</option>
                                        <option value="OTHER">📋 Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="resident-page-form-group">
                                <label>Issue Description *</label>
                                <textarea
                                    name="issueDescription"
                                    value={reportFormData.issueDescription}
                                    onChange={handleReportFormChange}
                                    required
                                    placeholder="Describe the issue in detail..."
                                    rows="3"
                                />
                            </div>

                            <div className="resident-page-form-group">
                                <label>Additional Comments</label>
                                <textarea
                                    name="comment"
                                    value={reportFormData.comment}
                                    onChange={handleReportFormChange}
                                    placeholder="Any additional information..."
                                    rows="2"
                                />
                            </div>

                            <div className="resident-page-form-actions">
                                <button
                                    type="button"
                                    className="resident-page-btn-secondary"
                                    onClick={() => setShowReportForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="resident-page-btn-primary">
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Private Report Form Modal */}
            {showPrivateReportForm && (
                <div className="resident-page-modal-overlay">
                    <div className="resident-page-modal-content">
                        <div className="resident-page-modal-header">
                            <h3>Send Private Report</h3>
                            {selectedCompanyId && (
                                <p style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>
                                    To: {companiesInBuilding?.find(c => c.id === selectedCompanyId)?.name}
                                </p>
                            )}
                            <button
                                className="resident-page-modal-close"
                                onClick={() => {
                                    setShowPrivateReportForm(false);
                                    setSelectedCompanyId(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmitPrivateReport} className="resident-page-report-form">
                            <div className="resident-page-form-row">
                                <div className="resident-page-form-group">
                                    <label>Report Title *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={privateReportFormData.name}
                                        onChange={handlePrivateReportFormChange}
                                        required
                                        placeholder="Brief description"
                                    />
                                </div>
                                <div className="resident-page-form-group">
                                    <label>Report Type *</label>
                                    <select
                                        name="reportType"
                                        value={privateReportFormData.reportType}
                                        onChange={handlePrivateReportFormChange}
                                        required
                                    >
                                        <option value="ELECTRICITY">⚡ Electricity</option>
                                        <option value="LIGHTNING">💡 Lighting</option>
                                        <option value="WATER_SUPPLY">💧 Water Supply</option>
                                        <option value="SEWAGE">🚽 Sewage</option>
                                        <option value="HEATING">🔥 Heating</option>
                                        <option value="GARBAGE_COLLECTION">🗑️ Garbage</option>
                                        <option value="SECURITY">🔒 Security</option>
                                        <option value="OTHER">📋 Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="resident-page-form-group">
                                <label>Issue Description *</label>
                                <textarea
                                    name="issueDescription"
                                    value={privateReportFormData.issueDescription}
                                    onChange={handlePrivateReportFormChange}
                                    required
                                    placeholder="Describe the issue in detail..."
                                    rows="3"
                                />
                            </div>
                            <div className="resident-page-form-group">
                                <label>Additional Comments</label>
                                <textarea
                                    name="comment"
                                    value={privateReportFormData.comment}
                                    onChange={handlePrivateReportFormChange}
                                    placeholder="Any additional information..."
                                    rows="2"
                                />
                            </div>
                            <div className="resident-page-form-actions">
                                <button
                                    type="button"
                                    className="resident-page-btn-secondary"
                                    onClick={() => {
                                        setShowPrivateReportForm(false);
                                        setSelectedCompanyId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="resident-page-btn-primary">
                                    Submit Private Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResidentPage;