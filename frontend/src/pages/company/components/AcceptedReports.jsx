import { useContext } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useReports } from "../../../hooks/useReports.js";
import { truncateText } from "../../../utility/turncateText.js";
import { CompanyPageContext } from "../../../context/company/CompanyPageContext.jsx";
import { CompanyReportContext } from "../../../context/company/CompanyReportContext.jsx";

import "./component-styles/AcceptedReports.css";

const AcceptedReports = () => {
    const { companyId } = useContext(CompanyPageContext);
    const { acceptedReports, reportTypeIcons } = useContext(CompanyReportContext);
    const { completeReport } = useReports();

    console.log(acceptedReports);

    return (
        <div className="company-page-accepted-reports-section">
            <div className="company-page-accepted-reports-card">
                <div className="company-page-card-header">
                    <FaFileAlt className="company-page-card-icon" />
                    <h3>Accepted Reports</h3>
                </div>

                <div className="company-page-accepted-reports-content">
                    {acceptedReports.map((report, index) => (
                        <div
                            key={index}
                            className={`company-page-accepted-report-item ${
                                report.reportStatus === "CANCELLED"
                                    ? "company-page-accepted-report-item--cancelled"
                                    : ""
                            }`}
                        >
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

                            {report.reportStatus === "CANCELLED" && (
                                <div className="company-page-cancelled-banner">
                                    <span>⛔ This report has been cancelled.</span>
                                    {report.systemMessage && (
                                        <span className="company-page-system-message">
                                            {report.systemMessage}
                                        </span>
                                    )}
                                </div>
                            )}

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

                                {report.reportStatus === "IN_PROGRESS" && (
                                    <button
                                        className="company-page-complete-btn"
                                        onClick={() => completeReport(report.reportId, companyId, 10)}
                                    >
                                        Complete Report
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AcceptedReports;