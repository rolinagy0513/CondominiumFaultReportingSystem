import {getServiceIcon} from "../../../utility/GetCompanyLogoUtility.jsx";
import {getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";

import "./component-styles/CompaniesContent.css"

const CompaniesContent = ({
                              handleBackToBuildings, companies,
                              companiesCurrentPage, pageSize,
                              companiesTotalElements, loadingCompanies,
                              removeCompanyAction, companiesTotalPages,
                              handleCompaniesPageChange,
}) =>{

    console.log(companies);

    return(
        <div className="companies-content">
            <div className="content-header">
                <button
                    className="back-button"
                    onClick={handleBackToBuildings}
                >
                    ← Back to Buildings
                </button>
                <h3>Companies List</h3>
                <p className="pagination-info">
                    Showing {companies.length > 0 ? (companiesCurrentPage * pageSize + 1) : 0} - {Math.min((companiesCurrentPage + 1) * pageSize, companiesTotalElements)} of {companiesTotalElements} companies
                </p>
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
                                onClick={() => handleCompaniesPageChange(companiesCurrentPage - 1)}
                                disabled={companiesCurrentPage === 0}
                            >
                                ← Previous
                            </button>

                            <div className="pagination-pages">
                                {companiesCurrentPage >= 3 && (
                                    <>
                                        <button
                                            className="pagination-page"
                                            onClick={() => handleCompaniesPageChange(0)}
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
                                                onClick={() => handleCompaniesPageChange(index)}
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
                                            onClick={() => handleCompaniesPageChange(companiesTotalPages - 1)}
                                        >
                                            {companiesTotalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className="pagination-btn"
                                onClick={() => handleCompaniesPageChange(companiesCurrentPage + 1)}
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