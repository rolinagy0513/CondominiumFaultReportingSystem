import AddBuildingForm from "./AddBuildingForm.jsx";

import {getServiceIcon} from "../../../utility/GetCompanyLogoUtility.jsx";
import {getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";

import "./component-styles/ContentArea.css"

const ContentArea = ({
                         currentView, buildings,
                         handleBackToBuildings, apartments,
                         currentPage, pageSize,
                         totalElements, loadingApartments,
                         handlePageChange, totalPages,
                         handleInputChange, addBuilding,
                         addBuildingFormData, isLoading,
                         message, companies,
                         loadingCompanies, handleCompaniesPageChange,
                         companiesCurrentPage, companiesTotalPages,
                         companiesTotalElements, setTargetId,
                         setIsRemovalModalOpen,setRemovalType
                     }) =>{

    const removeResidentAction = (apartmentId) =>{

        setRemovalType("apartment")
        setTargetId(apartmentId);
        console.log("IN THE CONTENT AREA AT THE FUNCTION WHICH SETS THE APARTMENT ID AND OPENS THE MODAL")
        console.log(apartmentId)
        setIsRemovalModalOpen(true);

    }

    const removeCompanyAction = (companyId) =>{

        setRemovalType("company")
        setTargetId(companyId);
        console.log("IN THE CONTENT AREA AT THE FUNCTION WHICH SETS THE COMPANY ID AND OPENS THE MODAL")
        console.log(companyId)
        setIsRemovalModalOpen(true);
    }

    return(
        <div className="content-area">
            {currentView === 'buildings' ? (
                <div className="buildings-content">
                    <div className="content-placeholder">
                        <h2>Building Management Dashboard</h2>
                        <p>You have {buildings.length} buildings in the system.</p>
                        <p>Click on a building in the sidebar to view its apartments.</p>
                    </div>
                </div>
            ) : currentView === 'apartments' ? (
                <div className="apartments-content">
                    <div className="content-header">
                        <button
                            className="back-button"
                            onClick={handleBackToBuildings}
                        >
                            ← Back to Buildings
                        </button>
                        <h3>Apartments List</h3>
                        <p className="pagination-info">
                            Showing {apartments.length > 0 ? (currentPage * pageSize + 1) : 0} - {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} apartments
                        </p>
                    </div>

                    {loadingApartments ? (
                        <div className="loading">Loading apartments...</div>
                    ) : (
                        <>
                            <div className="apartments-list">
                                {apartments.length > 0 ? (
                                    apartments.map(apartment => (
                                        <div key={apartment.id} className="apartment-card">
                                            <div className="apartment-header">
                                                <h4>Apartment {apartment.apartmentNumber}</h4>
                                                <span className={`status ${apartment.status?.toLowerCase() || 'available'}`}>
                                                    {apartment.status || 'Available'}
                                                </span>
                                            </div>
                                            <div className="apartment-details">
                                                <p><strong>Floor:</strong> {apartment.floorNumber}</p>
                                                <p><strong>Owner:</strong> {apartment.ownerName || 'Not assigned'}</p>
                                            </div>
                                            <button className="remove-button" onClick={()=>removeResidentAction(apartment.id)}>Remove Resident</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-apartments">
                                        No apartments found for this building.
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                    >
                                        ← Previous
                                    </button>

                                    <div className="pagination-pages">
                                        {currentPage >= 3 && (
                                            <>
                                                <button
                                                    className="pagination-page"
                                                    onClick={() => handlePageChange(0)}
                                                >
                                                    1
                                                </button>
                                                {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
                                            </>
                                        )}

                                        {[...Array(totalPages)].map((_, index) => {
                                            if (index >= currentPage - 1 && index <= currentPage + 1 && index >= 0 && index < totalPages) {
                                                return (
                                                    <button
                                                        key={index}
                                                        className={`pagination-page ${currentPage === index ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}

                                        {currentPage <= totalPages - 4 && (
                                            <>
                                                {currentPage < totalPages - 4 && <span className="pagination-ellipsis">...</span>}
                                                <button
                                                    className="pagination-page"
                                                    onClick={() => handlePageChange(totalPages - 1)}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : currentView === 'companies' ? (
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
                                            </div>
                                            {console.log(company)}
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
            ) : (
                <div className="add-building-content">
                    <div className="form-header">
                        <button
                            className="back-button"
                            onClick={handleBackToBuildings}
                        >
                            ← Back to Buildings
                        </button>
                        <h2>Add New Building</h2>
                    </div>
                    <div className="building-form">
                        <AddBuildingForm
                            handleChange={handleInputChange}
                            handleSubmit={addBuilding}
                            formData={addBuildingFormData}
                            isLoading={isLoading}
                            message={message}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContentArea;