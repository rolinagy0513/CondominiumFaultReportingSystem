import {useContext} from "react";

import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/ReportModal.css"

const PublicReportModal = ({handleSubmitPublicReport}) =>{

    // const {reportFormData, setReportFormData, setShowReportForm} = useContext(ResidentPageContext);

    const {reportFormData, setReportFormData, setShowReportForm} = useContext(ResidentReportContext);

    const handleReportFormChange = (e) => {
        const { name, value } = e.target;
        setReportFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return(
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
                                <option value="GARDENING">🌳 Gardening</option>
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
    )

}

export default PublicReportModal;