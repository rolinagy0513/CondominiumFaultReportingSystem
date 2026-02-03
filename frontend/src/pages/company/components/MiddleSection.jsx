import { useContext, useState } from "react";
import { FaFileAlt } from "react-icons/fa";

import { CompanyPageContext } from "../../../context/company/CompanyPageContext.jsx";
import { ResidentReportContext } from "../../../context/resident/ResidentReportContext.jsx";
import { PaginationContext } from "../../../context/general/PaginationContext.jsx";

import { useReports } from "../../../hooks/useReports.js";

import {truncateText} from "../../../utility/turncateText.js";

const MiddleSection = () => {
    const { companyId, privateReports } = useContext(CompanyPageContext);
    const { publicReports } = useContext(ResidentReportContext)

    const {
        currentPage, setCurrentPage,
        totalPages, currentPrivatePage,
        setCurrentPrivatePage, totalPrivatePage,
    } = useContext(PaginationContext);

    const { getAllPublicReports, getPrivateReportsForCompany, acceptReport } = useReports();

    const [expandedReportId, setExpandedReportId] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('public');

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
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await acceptReport(
                                                    report.reportId,
                                                    companyId,
                                                    currentPage,
                                                    currentPrivatePage
                                                );
                                            } catch (error) {
                                                console.error("Failed to accept report:", error);
                                            }
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
        <div className="company-page-middle-section">
            <div className="company-page-reports-section">
                <div className="company-page-reports-card">
                    <div className="company-page-card-header">
                        <FaFileAlt className="company-page-card-icon" />
                        <h3>Reports</h3>
                    </div>

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

                    <div className="company-page-reports-content">
                        {renderReportsList(currentReports)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiddleSection;