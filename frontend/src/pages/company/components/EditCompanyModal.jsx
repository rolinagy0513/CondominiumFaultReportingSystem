import { useContext, useState, useEffect } from "react";
import { CompanyPageContext } from "../../../context/company/CompanyPageContext.jsx";
import { CompanyNotificationContext } from "../../../context/company/CompanyNotificationContext.jsx";
import { useCompanies } from "../../../hooks/useCompanies.js";
import "./component-styles/EditCompanyModal.css";

const EditCompanyModal = () => {
    const { companyId, companyGroupIdentifier, usersCompany } = useContext(CompanyPageContext);
    const { isEditModalOpen, setIsEditModalOpen } = useContext(CompanyNotificationContext);
    const { editCompanyDetails } = useCompanies();

    const [formData, setFormData] = useState({
        companyName: '',
        companyIntroduction: '',
        companyAddress: '',
        phoneNumber: '',
        serviceType: '',
        minPrice: '',
        maxPrice: '',
        currency: ''
    });

    // Pre-fill form when modal opens with current company data
    useEffect(() => {
        if (isEditModalOpen && usersCompany) {
            setFormData({
                companyName: usersCompany.name || '',
                companyIntroduction: usersCompany.companyIntroduction || '',
                companyAddress: usersCompany.address || '',
                phoneNumber: usersCompany.phoneNumber || '',
                serviceType: usersCompany.serviceType || '',
                minPrice: usersCompany.priceRange?.minPrice || '',
                maxPrice: usersCompany.priceRange?.maxPrice || '',
                currency: usersCompany.priceRange?.currencyType || ''
            });
        }
    }, [isEditModalOpen, usersCompany]);

    const serviceTypeOptions = [
        { value: '', label: 'Select Service Type' },
        { value: 'ELECTRICIAN', label: 'Electrician' },
        { value: 'PLUMBER', label: 'Plumber' },
        { value: 'CLEANING', label: 'Cleaning' },
        { value: 'SECURITY', label: 'Security' },
        { value: 'HEATING_TECHNICIANS', label: 'Heating Technicians' },
        { value: 'ELEVATOR_MAINTENANCE', label: 'Elevator Maintenance' },
        { value: 'GARDENING', label: 'Gardening' },
        { value: 'OTHER', label: 'Other' }
    ];

    const currencyOptions = [
        { value: '', label: 'Select Currency' },
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'USD', label: 'US Dollar ($)' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const editData = {
            companyId: companyId,
            groupIdentifier: companyGroupIdentifier,
            companyName: formData.companyName?.trim() || null,
            companyIntroduction: formData.companyIntroduction?.trim() || null,
            companyAddress: formData.companyAddress?.trim() || null,
            phoneNumber: formData.phoneNumber?.trim() || null,
            serviceType: formData.serviceType || null,
            priceRange: {
                minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
                maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
                currencyType: formData.currency || null
            }
        };

        console.log(editData);

        try {
            await editCompanyDetails(editData);
            setIsEditModalOpen(false);
            setFormData({
                companyName: '',
                companyIntroduction: '',
                companyAddress: '',
                phoneNumber: '',
                serviceType: '',
                minPrice: '',
                maxPrice: '',
                currency: ''
            });
        } catch (error) {
            console.error("Error editing company:", error);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        // Reset form on close
        setFormData({
            companyName: '',
            companyIntroduction: '',
            companyAddress: '',
            phoneNumber: '',
            serviceType: '',
            minPrice: '',
            maxPrice: '',
            currency: ''
        });
    };

    if (!isEditModalOpen) return null;

    return (
        <div className="ecm-modal-overlay" onClick={handleCloseModal}>
            <div className="ecm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="ecm-modal-header">
                    <h2>Edit Company Details</h2>
                    <button className="ecm-close-button" onClick={handleCloseModal}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="ecm-edit-company-form">
                    <div className="ecm-form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName || ''}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className="ecm-form-group">
                        <label htmlFor="companyIntroduction">Company Introduction</label>
                        <textarea
                            id="companyIntroduction"
                            name="companyIntroduction"
                            value={formData.companyIntroduction || ''}
                            onChange={handleInputChange}
                            placeholder="Enter company description"
                            rows="4"
                        />
                    </div>

                    <div className="ecm-form-group">
                        <label htmlFor="companyAddress">Company Address</label>
                        <input
                            type="text"
                            id="companyAddress"
                            name="companyAddress"
                            value={formData.companyAddress || ''}
                            onChange={handleInputChange}
                            placeholder="Enter company address"
                        />
                    </div>

                    <div className="ecm-form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="ecm-form-group">
                        <label htmlFor="serviceType">Service Type</label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType || ''}
                            onChange={handleInputChange}
                        >
                            {serviceTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Fields */}
                    <div className="ecm-price-row">
                        <div className="ecm-form-group ecm-price-field">
                            <label htmlFor="minPrice">Min Price</label>
                            <input
                                type="number"
                                id="minPrice"
                                name="minPrice"
                                value={formData.minPrice || ''}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="ecm-form-group ecm-price-field">
                            <label htmlFor="maxPrice">Max Price</label>
                            <input
                                type="number"
                                id="maxPrice"
                                name="maxPrice"
                                value={formData.maxPrice || ''}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="ecm-form-group ecm-price-field">
                            <label htmlFor="currency">Currency</label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency || ''}
                                onChange={handleInputChange}
                            >
                                {currencyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="ecm-form-actions">
                        <button
                            type="button"
                            className="ecm-cancel-button"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ecm-submit-button"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyModal;