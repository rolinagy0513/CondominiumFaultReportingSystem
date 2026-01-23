import {useContext, useState} from "react";
import {AdminModalContext} from "../../../context/admin/AdminModalContext.jsx";
import {BuildingContext} from "../../../context/admin/BuildingContext.jsx";

import "../../resident/components/components-styles/ReportModal.css"

const AddCompanyModal = () => {
    const {addCompanyModalOpen, setAddCompanyModalOpen} = useContext(AdminModalContext);
    const {buildings} = useContext(BuildingContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        introduction: '',
        serviceType: '',
        buildingId: '',
        userToAddEmail: ''
    });

    const handleFormChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You'll need to implement the actual submission logic
        console.log("Form submitted:", formData);
        // Call your API service to add company
        setAddCompanyModalOpen(false);
    };

    if (!addCompanyModalOpen) return null;

    return (
        <div className="resident-page-modal-overlay">
            <div className="resident-page-modal-content">
                <div className="resident-page-modal-header">
                    <h3>Add New Company</h3>
                    <button
                        className="resident-page-modal-close"
                        onClick={() => setAddCompanyModalOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="resident-page-report-form">
                    <div className="resident-page-form-row">
                        <div className="resident-page-form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                placeholder="Enter company name"
                            />
                        </div>
                        <div className="resident-page-form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                                placeholder="company@example.com"
                            />
                        </div>
                    </div>

                    <div className="resident-page-form-row">
                        <div className="resident-page-form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleFormChange}
                                required
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div className="resident-page-form-group">
                            <label>Company Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                required
                                placeholder="123 Main St, City"
                            />
                        </div>
                    </div>

                    <div className="resident-page-form-row">
                        <div className="resident-page-form-group">
                            <label>Service Type *</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">Select a service type</option>
                                <option value="ELECTRICIAN">⚡ Electrician</option>
                                <option value="PLUMBER">🔧 Plumber</option>
                                <option value="CLEANING">🧹 Cleaning</option>
                                <option value="SECURITY">🔒 Security</option>
                                <option value="HEATING_TECHNICIANS">🔥 Heating Technicians</option>
                                <option value="ELEVATOR_MAINTENANCE">🛗 Elevator Maintenance</option>
                                <option value="GARDENING">🌳 Gardening</option>
                                <option value="OTHER">📋 Other Services</option>
                            </select>
                        </div>
                        <div className="resident-page-form-group">
                            <label>Assign to Building *</label>
                            <select
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">Select a building</option>
                                {buildings && buildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.address}, Building #{building.buildingNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="resident-page-form-group">
                        <label>User Email (to associate with company) *</label>
                        <input
                            type="email"
                            name="userToAddEmail"
                            value={formData.userToAddEmail}
                            onChange={handleFormChange}
                            required
                            placeholder="user@example.com"
                        />
                        <small className="company-modal-hint">
                            This user will be promoted to COMPANY role and associated with this company
                        </small>
                    </div>

                    <div className="resident-page-form-group">
                        <label>Company Introduction *</label>
                        <textarea
                            name="introduction"
                            value={formData.introduction}
                            onChange={handleFormChange}
                            required
                            placeholder="Describe the company's services and expertise..."
                            rows="3"
                        />
                    </div>

                    <div className="resident-page-form-actions">
                        <button
                            type="button"
                            className="resident-page-btn-secondary"
                            onClick={() => setAddCompanyModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="resident-page-btn-primary">
                            Add Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCompanyModal;