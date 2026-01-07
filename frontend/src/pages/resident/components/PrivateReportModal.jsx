import {useContext} from "react";

import {ResidentCompanyContext} from "../../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/ReportModal.css"

const PrivateReportModal = ({handleSubmitPrivateReport}) =>{

    const handlePrivateReportFormChange = (e) =>{
        const {name, value} = e.target;
        setPrivateReportData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // const {
    //     selectedCompanyId, setSelectedCompanyId,
    //     companiesInBuilding, privateReportFormData,
    //     setPrivateReportData, setShowPrivateReportForm
    // } = useContext(ResidentPageContext);

    const {
        companiesInBuilding, setSelectedCompanyId,
        selectedCompanyId,
    } = useContext(ResidentCompanyContext);

    const{
        privateReportFormData, setPrivateReportData,
        setShowPrivateReportForm
    } = useContext(ResidentReportContext);

    return(
        <div className="resident-page-modal-overlay">
            <div className="resident-page-modal-content">
                <div className="resident-page-modal-header">
                    <h3>Send Private Report</h3>
                    {selectedCompanyId && (
                        <p>
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
    )
}

export default PrivateReportModal;