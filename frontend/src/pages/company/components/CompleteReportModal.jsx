import { useContext, useState } from "react";

import { CompanyNotificationContext } from "../../../context/company/CompanyNotificationContext.jsx";
import { CompanyReportContext } from "../../../context/company/CompanyReportContext.jsx";
import { CompanyPageContext } from "../../../context/company/CompanyPageContext.jsx";

import { useReports } from "../../../hooks/useReports.js";

import "./component-styles/CompleteReportModal.css";

const CompleteReportModal = () => {
    const { isCompleteReportModalOpen, setIsCompleteReportModalOpen } = useContext(CompanyNotificationContext);
    const { reportToCompleteId, setReportToCompleteId } = useContext(CompanyReportContext);
    const { companyId } = useContext(CompanyPageContext);
    const { completeReport } = useReports();

    const [crmCost, setCrmCost] = useState("");
    const [crmIsSubmitting, setCrmIsSubmitting] = useState(false);
    const [crmError, setCrmError] = useState("");

    const handleCrmCostChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setCrmCost(value);
            setCrmError("");
        }
    };

    const handleCrmSubmit = async (e) => {
        e.preventDefault();

        const numericCost = parseFloat(crmCost);
        if (!crmCost || isNaN(numericCost) || numericCost <= 0) {
            setCrmError("Please enter a valid positive cost");
            return;
        }

        setCrmIsSubmitting(true);
        setCrmError("");

        try {

            console.log(companyId);
            console.log(reportToCompleteId);
            console.log(numericCost);

            await completeReport(reportToCompleteId, companyId, numericCost);

            handleCrmCloseModal();
        } catch (err) {
            console.error("Failed to complete report:", err);
            setCrmError(err.message || "An error occurred while completing the report");
        } finally {
            setCrmIsSubmitting(false);
        }
    };

    const handleCrmCloseModal = () => {
        setIsCompleteReportModalOpen(false);
        setReportToCompleteId(null);
        setCrmCost("");
        setCrmError("");
        setCrmIsSubmitting(false);
    };

    if (!isCompleteReportModalOpen) return null;

    return (
        <div className="crm-modal-overlay" onClick={handleCrmCloseModal}>
            <div className="crm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="crm-modal-header">
                    <h2 className="crm-modal-title">Complete Report</h2>
                    <button
                        className="crm-close-button"
                        onClick={handleCrmCloseModal}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleCrmSubmit} className="crm-form">
                    <div className="crm-form-group">
                        <label htmlFor="crm-cost-input" className="crm-label">
                            Service Cost *
                        </label>
                        <input
                            type="text"
                            id="crm-cost-input"
                            name="crmCost"
                            className="crm-input"
                            value={crmCost}
                            onChange={handleCrmCostChange}
                            placeholder="0.00"
                            disabled={crmIsSubmitting}
                            autoFocus
                        />
                        {crmError && (
                            <div className="crm-error-message" role="alert">
                                ⚠️ {crmError}
                            </div>
                        )}
                        <small className="crm-hint">
                            Enter the final cost for this service (e.g., 150.00)
                        </small>
                    </div>

                    <div className="crm-form-actions">
                        <button
                            type="button"
                            className="crm-cancel-button"
                            onClick={handleCrmCloseModal}
                            disabled={crmIsSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="crm-submit-button"
                            disabled={crmIsSubmitting || !crmCost}
                        >
                            {crmIsSubmitting ? "Submitting..." : "Complete Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteReportModal;