import {useContext, useState} from "react";

import {FaBuilding, FaExclamationTriangle, FaFileAlt, FaHome} from "react-icons/fa";
import {MdLocationOn} from "react-icons/md";

import {getServiceIcon} from "../../../utility/GetCompanyLogoUtility.jsx";

import {PaginationContext} from "../../../context/general/PaginationContext.jsx";
import {ResidentApartmentContext} from "../../../context/resident/ResidentApartmentContext.jsx";
import {ResidentBuildingContext} from "../../../context/resident/ResidentBuildingContext.jsx";
import {ResidentCompanyContext} from "../../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/MainContent.css"

const MainContent = ({
                         getAllPublicReports,
                         setShowReportForm,
                         setShowPrivateReportForm
                     }) =>{

    // const {
    //     ownersApartment, ownersBuilding,
    //     companiesInBuilding, publicReports,inProgressReports,
    //     setSelectedCompanyId,
    //     selectedServiceType, setSelectedServiceType,
    // } = useContext(ResidentPageContext);

    const {
        ownersApartment
    } = useContext(ResidentApartmentContext);

    const {
        ownersBuilding
    } = useContext(ResidentBuildingContext);

    const {
        companiesInBuilding, setSelectedCompanyId,
        selectedServiceType, setSelectedServiceType,
    } = useContext(ResidentCompanyContext);

    const {
        publicReports,inProgressReports,
    } = useContext(ResidentReportContext);

    const {
        currentPage, setCurrentPage,
        totalPages
    } = useContext(PaginationContext);

    const serviceTypes = [
        { value: "ALL", label: "All Services" },
        { value: "ELECTRICIAN", label: "Electrician" },
        { value: "PLUMBER", label: "Plumber" },
        { value: "CLEANING", label: "Cleaning" },
        { value: "SECURITY", label: "Security" },
        { value: "ELEVATOR_MAINTENANCE", label: "Elevator Maintenance" },
        { value: "HEATING_TECHNICIANS", label: "Heating Technicians" },
        { value: "GARDENING", label: "Gardening" },
        { value: "OTHER", label: "Other" }
    ];

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

    const handleReportsPageChange = (newPage) => {
        setCurrentPage(newPage);
        getAllPublicReports(newPage);
    };

    const toggleReportExpansion = (index) => {
        setExpandedReportId(expandedReportId === index ? null : index);
    };

    const handleServiceTypeChange = (e) => {
        const value = e.target.value;
        setSelectedServiceType(value);
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return(
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

            <div className="resident-page-content-right">
                <div className="resident-page-companies-card">
                    <div className="resident-page-card-header">
                        <h3>Service Companies</h3>
                        <div className="resident-page-filter-container">
                            <select
                                value={selectedServiceType || "ALL"}
                                onChange={handleServiceTypeChange}
                                className="resident-page-service-filter"
                            >
                                {serviceTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
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
    )

}

export default MainContent;