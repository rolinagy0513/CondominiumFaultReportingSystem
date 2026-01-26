import {useContext, useEffect} from "react";

import {ResidentCompanyContext} from "../../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/ReportModal.css"

const PrivateReportModal = ({handleSubmitPrivateReport}) =>{

    const {
        companiesInBuilding, setSelectedCompanyId,
        selectedCompanyId,
    } = useContext(ResidentCompanyContext);

    const{
        privateReportFormData, setPrivateReportData,
        setShowPrivateReportForm, selectedCompanyServiceType
    } = useContext(ResidentReportContext);

    // Map company service type to report type
    const serviceTypeToReportTypeMap = {
        ELECTRICIAN: 'ELECTRICITY',
        PLUMBER: 'WATER_SUPPLY',
        CLEANING: 'GARBAGE_COLLECTION',
        SECURITY: 'SECURITY',
        ELEVATOR_MAINTENANCE: 'ELEVATOR',
        HEATING_TECHNICIANS: 'HEATING',
        GARDENING: 'GARDENING',
        OTHER: 'OTHER'
    };

    // When the modal opens or selectedCompanyServiceType changes, set the reportType
    useEffect(() => {
        if (selectedCompanyServiceType) {
            // Map the company service type to report type
            const mappedReportType = serviceTypeToReportTypeMap[selectedCompanyServiceType] || 'OTHER';

            // Update the private report form data with the mapped report type
            setPrivateReportData(prev => ({
                ...prev,
                reportType: mappedReportType
            }));
        }
    }, [selectedCompanyServiceType]);

    const handlePrivateReportFormChange = (e) =>{
        const {name, value} = e.target;
        setPrivateReportData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return(
        <div className="resident-page-modal-overlay">
            <div className="resident-page-modal-content">
                <div className="resident-page-modal-header">
                    <h3>Send Private Report</h3>
                    {selectedCompanyId && (
                        <div className="company-service-info">
                            <p>
                                To: {companiesInBuilding?.find(c => c.id === selectedCompanyId)?.name}
                            </p>
                        </div>
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
                        {/*<div className="resident-page-form-group">*/}
                        {/*    <label>Report Type *</label>*/}
                        {/*    <div className="report-type-display">*/}
                        {/*        <span className="service-type-badge">*/}
                        {/*            {selectedCompanyServiceType}: {privateReportFormData.reportType}*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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