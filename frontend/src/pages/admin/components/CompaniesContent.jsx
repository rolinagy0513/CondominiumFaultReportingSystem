import {useContext, useEffect} from "react";

import {getServiceIcon} from "../../../utility/GetCompanyLogoUtility.jsx";
import {getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";

import {CompanyContext} from "../../../context/admin/CompanyContext.jsx";

import "./component-styles/CompaniesContent.css"
import {AdminModalContext} from "../../../context/admin/AdminModalContext.jsx";

const CompaniesContent = ({
                              handleBackToBuildings, companies,
                              companiesCurrentPage, pageSize,
                              companiesTotalElements, loadingCompanies,
                              removeCompanyAction, companiesTotalPages,
                              handleCompaniesPageChange, getCompanies,
                              getCompaniesByServiceType
                          }) =>{

    const {selectedServiceType, setSelectedServiceType} = useContext(CompanyContext);

    const {setAddCompanyModalOpen} = useContext(AdminModalContext);

    const serviceTypes = [
        { value: "ALL", label: "All Services" },
        { value: "ELECTRICIAN", label: "Electrician" },
        { value: "PLUMBER", label: "Plumber" },
        { value: "CLEANING", label: "Cleaning" },
        { value: "SECURITY", label: "Security" },
        { value: "ELEVATOR_MAINTENANCE", label: "Elevator Maintenance" },
        { value: "HEATING_TECHNICIANS", label: "Heating Technicians" },
        { value: "GARDENING", label: "Gardening" },
        { value: "OTHER", label: "Other" }
    ];

    const handleServiceTypeChange = (e) => {
        const value = e.target.value;
        setSelectedServiceType(value);

        handleCompaniesPageChange(0);

        if (value === "ALL") {
            getCompanies(0);
        } else {
            getCompaniesByServiceType(value);
        }
    };

    useEffect(() => {
        if (selectedServiceType === "ALL" || !selectedServiceType) {
            getCompanies(0);
        } else {
            getCompaniesByServiceType(selectedServiceType);
        }
    }, []);

    return(
        <div className="companies-content">
            <div className="content-header">
                <button
                    className="back-button"
                    onClick={handleBackToBuildings}
                >
                    ← Back to Buildings
                </button>
                <div className="header-title-section">
                    <h3>Companies List</h3>
                    <div className="companies-filter-container">
                        <select
                            value={selectedServiceType || "ALL"}
                            onChange={handleServiceTypeChange}
                            className="companies-service-filter"
                        >
                            {serviceTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="pagination-info">
                    Showing {companies.length > 0 ? (companiesCurrentPage * pageSize + 1) : 0} - {Math.min((companiesCurrentPage + 1) * pageSize, companiesTotalElements)} of {companiesTotalElements} companies
                </p>
            </div>

             <div className="companies-content-manual-button-container">
                 <button className="companies-content-manual-button" onClick={()=> setAddCompanyModalOpen(true)}>Add a company manually</button>
             </div>

            {loadingCompanies ? (
                <div className="loading">Loading companies...</div>
            ) : (
                <>
                    <div className="companies-list">
                        {companies.length > 0 ? (
                            companies.map(company => (
                                <div key={company.id} className="company-card">
                                    <div className="company-header">
                                        <div className="company-title-section">
                                            <div className="company-icon-wrapper">
                                                {getServiceIcon(company.serviceType)}
                                            </div>
                                            <h4>{company.name}</h4>
                                        </div>
                                        <span className={`service-type ${company.serviceType?.toLowerCase() || 'unknown'}`}>
                                                    {getServiceTypeDisplay(company.serviceType)}
                                                </span>
                                    </div>
                                    <div className="company-details">
                                        <p><strong>Email:</strong> {company.email}</p>
                                        <p><strong>Phone:</strong> {company.phoneNumber}</p>
                                        <p><strong>Address:</strong> {company.address}</p>
                                        <p><strong>Introduction:</strong>{company.companyIntroduction}</p>
                                    </div>
                                    <button className="remove-button" onClick={()=>removeCompanyAction(company.id)}>Remove Company</button>
                                </div>
                            ))
                        ) : (
                            <div className="no-companies">
                                No companies found.
                            </div>
                        )}
                    </div>

                    {companiesTotalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => {
                                    const newPage = companiesCurrentPage - 1;
                                    handleCompaniesPageChange(newPage);
                                    // Call appropriate function for the new page
                                    if (selectedServiceType === "ALL") {
                                        getCompanies(newPage);
                                    } else {
                                        getCompaniesByServiceType(selectedServiceType);
                                    }
                                }}
                                disabled={companiesCurrentPage === 0}
                            >
                                ← Previous
                            </button>

                            <div className="pagination-pages">
                                {companiesCurrentPage >= 3 && (
                                    <>
                                        <button
                                            className="pagination-page"
                                            onClick={() => {
                                                handleCompaniesPageChange(0);
                                                if (selectedServiceType === "ALL") {
                                                    getCompanies(0);
                                                } else {
                                                    getCompaniesByServiceType(selectedServiceType);
                                                }
                                            }}
                                        >
                                            1
                                        </button>
                                        {companiesCurrentPage > 3 && <span className="pagination-ellipsis">...</span>}
                                    </>
                                )}

                                {[...Array(companiesTotalPages)].map((_, index) => {
                                    if (index >= companiesCurrentPage - 1 && index <= companiesCurrentPage + 1 && index >= 0 && index < companiesTotalPages) {
                                        return (
                                            <button
                                                key={index}
                                                className={`pagination-page ${companiesCurrentPage === index ? 'active' : ''}`}
                                                onClick={() => {
                                                    handleCompaniesPageChange(index);
                                                    if (selectedServiceType === "ALL") {
                                                        getCompanies(index);
                                                    } else {
                                                        getCompaniesByServiceType(selectedServiceType);
                                                    }
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}

                                {companiesCurrentPage <= companiesTotalPages - 4 && (
                                    <>
                                        {companiesCurrentPage < companiesTotalPages - 4 && <span className="pagination-ellipsis">...</span>}
                                        <button
                                            className="pagination-page"
                                            onClick={() => {
                                                const lastPage = companiesTotalPages - 1;
                                                handleCompaniesPageChange(lastPage);
                                                if (selectedServiceType === "ALL") {
                                                    getCompanies(lastPage);
                                                } else {
                                                    getCompaniesByServiceType(selectedServiceType);
                                                }
                                            }}
                                        >
                                            {companiesTotalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className="pagination-btn"
                                onClick={() => {
                                    const newPage = companiesCurrentPage + 1;
                                    handleCompaniesPageChange(newPage);
                                    if (selectedServiceType === "ALL") {
                                        getCompanies(newPage);
                                    } else {
                                        getCompaniesByServiceType(selectedServiceType);
                                    }
                                }}
                                disabled={companiesCurrentPage === companiesTotalPages - 1}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )

}

export default CompaniesContent;