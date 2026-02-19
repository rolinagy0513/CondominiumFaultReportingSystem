import { useContext, useState } from "react";
import { AdminModalContext } from "../../../context/admin/AdminModalContext.jsx";
import { BuildingContext } from "../../../context/admin/BuildingContext.jsx";
import { AdminPanelContext } from "../../../context/admin/AdminPanelContext.jsx";
import { useCompanies } from "../../../hooks/useCompanies.js";
import "./component-styles/AddCompanyModal.css";

const AddCompanyModal = () => {
    const { addCompanyModalOpen, setAddCompanyModalOpen } = useContext(AdminModalContext);
    const { buildings } = useContext(BuildingContext);
    const { setCurrentView } = useContext(AdminPanelContext);
    const { addCompany } = useCompanies();

    const [formData, setFormData] = useState({
        userToAddEmail: '',
        buildingId: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        introduction: '',
        serviceType: '',
        minPrice: '',
        maxPrice: '',
        currency: '',
    });

    const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
    const [buildingOpen, setBuildingOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const companyData = {
            userToAddEmail: formData.userToAddEmail,
            buildingId: formData.buildingId,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            introduction: formData.introduction,
            serviceType: formData.serviceType,
            priceRange: {
                minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
                maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
                currencyType: formData.currency || null
            }
        };

        try {

            await addCompany(companyData);
            console.log("Form submitted:", companyData);
            setAddCompanyModalOpen(false);
            setCurrentView("buildings");

        } catch (error) {

            alert(`Failed to add company: ${error.message}`);
        }
    };

    const serviceTypeOptions = [
        { value: "ELECTRICIAN", label: "⚡ Electrician" },
        { value: "PLUMBER", label: "🔧 Plumber" },
        { value: "CLEANING", label: "🧹 Cleaning" },
        { value: "SECURITY", label: "🔒 Security" },
        { value: "HEATING_TECHNICIANS", label: "🔥 Heating Technicians" },
        { value: "ELEVATOR_MAINTENANCE", label: "🛗 Elevator Maintenance" },
        { value: "GARDENING", label: "🌳 Gardening" },
        { value: "OTHER", label: "📋 Other Services" }
    ];

    const currencyOptions = [
        { value: "EUR", label: "€ Euro" },
        { value: "USD", label: "$ US Dollar" }
    ];

    const CustomSelect = ({ name, value, onChange, options, placeholder, required, isOpen, setIsOpen }) => {
        const selectedOption = options.find(opt => opt.value === value);

        return (
            <div className="add-company-custom-select">
                <button
                    type="button"
                    className={`add-company-select-button ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={!selectedOption ? 'add-company-select-placeholder' : ''}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className="add-company-select-arrow"></span>
                </button>

                {isOpen && (
                    <div className="add-company-select-dropdown">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`add-company-select-option ${value === option.value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange({ target: { name, value: option.value } });
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}

                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        height: 0,
                        width: 0,
                        pointerEvents: 'none'
                    }}
                >
                    <option value="">{placeholder}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const BuildingCustomSelect = ({ name, value, onChange, buildings, placeholder, required, isOpen, setIsOpen }) => {
        const selectedBuilding = buildings?.find(b => b.id.toString() === value?.toString());

        return (
            <div className="add-company-custom-select">
                <button
                    type="button"
                    className={`add-company-select-button ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={!selectedBuilding ? 'add-company-select-placeholder' : ''}>
                        {selectedBuilding
                            ? `${selectedBuilding.address}, Building #${selectedBuilding.buildingNumber}`
                            : placeholder
                        }
                    </span>
                    <span className="add-company-select-arrow"></span>
                </button>

                {isOpen && (
                    <div className="add-company-select-dropdown">
                        {buildings && buildings.length > 0 ? (
                            buildings.map((building) => (
                                <div
                                    key={building.id}
                                    className={`add-company-select-option ${value === building.id.toString() ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange({ target: { name, value: building.id.toString() } });
                                        setIsOpen(false);
                                    }}
                                >
                                    {building.address}, Building #{building.buildingNumber}
                                </div>
                            ))
                        ) : (
                            <div className="add-company-select-empty">No buildings available</div>
                        )}
                    </div>
                )}

                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        height: 0,
                        width: 0,
                        pointerEvents: 'none'
                    }}
                >
                    <option value="">{placeholder}</option>
                    {buildings?.map(building => (
                        <option key={building.id} value={building.id}>
                            {building.address}, Building #{building.buildingNumber}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    if (!addCompanyModalOpen) return null;

    return (
        <div className="add-company-modal-overlay">
            <div className="add-company-modal-content">
                <div className="add-company-modal-header">
                    <h3>Add New Company</h3>
                    <button
                        className="add-company-modal-close"
                        onClick={() => setAddCompanyModalOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="add-company-form">
                    <div className="add-company-form-row">
                        <div className="add-company-form-group">
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
                        <div className="add-company-form-group">
                            <label>Contact Email *</label>
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

                    <div className="add-company-form-row">
                        <div className="add-company-form-group">
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
                        <div className="add-company-form-group">
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

                    <div className="add-company-form-row">
                        <div className="add-company-form-group">
                            <label>Service Type *</label>
                            <CustomSelect
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleFormChange}
                                options={serviceTypeOptions}
                                placeholder="Select a service type"
                                required
                                isOpen={serviceTypeOpen}
                                setIsOpen={setServiceTypeOpen}
                            />
                        </div>
                        <div className="add-company-form-group">
                            <label>Assign to Building *</label>
                            <BuildingCustomSelect
                                name="buildingId"
                                value={formData.buildingId}
                                onChange={handleFormChange}
                                buildings={buildings}
                                placeholder="Select a building"
                                required
                                isOpen={buildingOpen}
                                setIsOpen={setBuildingOpen}
                            />
                        </div>
                    </div>

                    {/* New row for price range */}
                    <div className="add-company-form-row add-company-form-row--three-cols">
                        <div className="add-company-form-group">
                            <label>Min Price</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={formData.minPrice}
                                onChange={handleFormChange}
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="add-company-form-group">
                            <label>Max Price</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={formData.maxPrice}
                                onChange={handleFormChange}
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="add-company-form-group">
                            <label>Currency</label>
                            <CustomSelect
                                name="currency"
                                value={formData.currency}
                                onChange={handleFormChange}
                                options={currencyOptions}
                                placeholder="Select currency"
                                isOpen={currencyOpen}
                                setIsOpen={setCurrencyOpen}
                            />
                        </div>
                    </div>

                    <div className="add-company-form-group">
                        <label>Registered User Email (to associate with company) *</label>
                        <input
                            type="email"
                            name="userToAddEmail"
                            value={formData.userToAddEmail}
                            onChange={handleFormChange}
                            required
                            placeholder="user@example.com"
                        />
                        <small className="add-company-hint">
                            This user will be promoted to COMPANY role and associated with this company
                        </small>
                    </div>

                    <div className="add-company-form-group">
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

                    <div className="add-company-form-actions">
                        <button
                            type="button"
                            className="add-company-btn-secondary"
                            onClick={() => setAddCompanyModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="add-company-btn-primary">
                            Add Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompanyModal;