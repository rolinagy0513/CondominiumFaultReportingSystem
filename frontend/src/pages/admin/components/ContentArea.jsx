import AddBuildingForm from "./AddBuildingForm.jsx";

import BuildingsContent from "./BuildingsContent.jsx";
import ApartmentsContent from "./ApartmentsContent.jsx";
import CompaniesContent from "./CompaniesContent.jsx";

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
                         setIsRemovalModalOpen,setRemovalType,
                         setModalText, setModalButtonText, setModalTitleText
                     }) =>{

    const removeResidentAction = (apartmentId) =>{

        setRemovalType("apartment")
        setTargetId(apartmentId);

        setModalTitleText("Remove Resident")
        setModalText("Are you sure you want to remove the resident from the apartment ? ")
        setModalButtonText("Remove Resident!")

        setIsRemovalModalOpen(true);

    }

    const removeCompanyAction = (companyId) =>{

        setRemovalType("company")
        setTargetId(companyId);

        setModalTitleText("Remove Company")
        setModalText("Are you sure you want to remove the company from the system ? ")
        setModalButtonText("Remove Company!")

        setIsRemovalModalOpen(true);
    }

    return(
        <div className="content-area">
            {currentView === 'buildings' ? (
                <BuildingsContent
                    buildings={buildings}
                />
            ) : currentView === 'apartments' ? (
                <ApartmentsContent
                handleBackToBuildings={handleBackToBuildings}
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={totalElements}
                loadingApartments={loadingApartments}
                apartments={apartments}
                removeResidentAction={removeResidentAction}
                totalPages={totalPages}
                handlePageChange={handlePageChange}

                />
            ) : currentView === 'companies' ? (
                <CompaniesContent
                handleBackToBuildings={handleBackToBuildings}
                companies={companies}
                companiesCurrentPage={companiesCurrentPage}
                pageSize={pageSize}
                companiesTotalElements={companiesTotalElements}
                loadingCompanies={loadingCompanies}
                removeCompanyAction={removeCompanyAction}
                companiesTotalPages={companiesTotalPages}
                handleCompaniesPageChange={handleCompaniesPageChange}
                />
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