import {useContext} from "react";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";
import "./components-styles/CompletedReportModal.css"

const CompletedReportModal = () => {
    const {completedReports, completeReportModalOpen, setCompleteReportModalOpen} = useContext(ResidentReportContext);

    if (!completeReportModalOpen) return null;

    return(
        <div className="resident-page-complete-modal-overlay">
            <div className="resident-page-complete-modal-content">
                <div className="resident-page-complete-modal-header">
                    <h3>Completed Reports</h3>
                    <button onClick={() => setCompleteReportModalOpen(false)}>X</button>
                </div>

                <div className="resident-page-completed-reports">
                    {completedReports.length === 0 ? (
                        <div className="resident-page-complete-empty-state">
                            <p>No completed reports yet</p>
                        </div>
                    ) : (
                        completedReports.map((report, index) => (
                            <div key={index} className="resident-page-complete-report-card">
                                <div className="resident-page-complete-report-header">
                                    <div className="resident-page-complete-report-title-section">
                                        <h4>{report.reportName}</h4>
                                    </div>
                                </div>

                                <div className="resident-page-complete-report-details">
                                    <div className="resident-page-complete-report-row">
                                        <div className="resident-page-complete-report-field">
                                            <strong>Sender:</strong> {report.residentName}
                                        </div>
                                        <div className="resident-page-complete-report-field">
                                            <strong>Location:</strong> Floor: {report.floorNumber} Room: {report.roomNumber}
                                        </div>
                                        <div className="resident-page-complete-report-cost">
                                            <strong>Cost:</strong> ${report.cost}
                                        </div>
                                    </div>

                                    <div className="resident-page-complete-report-row">
                                        <div className="resident-page-complete-report-field">
                                            <strong>Company:</strong> {report.companyName|| "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="resident-page-complete-report-actions">
                                    <button className="resident-page-complete-pay-feedback-btn">
                                        💳 Pay and Send Feedback
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CompletedReportModal;