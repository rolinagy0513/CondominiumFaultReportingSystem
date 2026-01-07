import {useContext} from "react";

import AddBuildingForm from "./AddBuildingForm.jsx";
import BuildingsContent from "./BuildingsContent.jsx";
import ApartmentsContent from "./ApartmentsContent.jsx";
import CompaniesContent from "./CompaniesContent.jsx";

import {AdminPanelContext} from "../../../context/admin/AdminPanelContext.jsx";
import {BuildingContext} from "../../../context/admin/BuildingContext.jsx";
import {ApartmentContext} from "../../../context/admin/ApartmentContext.jsx";
import {CompanyContext} from "../../../context/admin/CompanyContext.jsx";
import {PaginationContext} from "../../../context/general/PaginationContext.jsx";
import {AdminModalContext} from "../../../context/admin/AdminModalContext.jsx";
import {AddBuildingContext} from "../../../context/admin/AddBuildingContext.jsx";
import {FeedbackContext} from "../../../context/general/FeedbackContext.jsx";

import "./component-styles/ContentArea.css"

const ContentArea = ({
                         handleBackToBuildings, handlePageChange,
                         handleInputChange, addBuilding,
                         handleCompaniesPageChange, handleAssignOwner,
                         getExcelTemplate, uploadExcelFile,
                         getCompanies, getCompaniesByServiceType
                     }) => {

    const{
        buildings,
    } = useContext(BuildingContext);

    const{
        apartments,
        loadingApartments,
    } = useContext(ApartmentContext);

    const{
        companies,
        loadingCompanies, companiesCurrentPage,
        companiesTotalPages, companiesTotalElements,
    } = useContext(CompanyContext);

    const {
        currentView,
    } = useContext(AdminPanelContext);

    const {
        currentPage, totalPages,
        totalElements, pageSize
    } = useContext(PaginationContext);

    const {
        setIsRemovalModalOpen, setTargetId,
        setModalText, setRemovalType,
        setModalButtonText, setModalTitleText
    } = useContext(AdminModalContext);

    const {
        addBuildingFormData,
    } = useContext(AddBuildingContext);


    const {isLoading, message} = useContext(FeedbackContext);

    const removeResidentAction = (apartmentId) => {
        setRemovalType("apartment")
        setTargetId(apartmentId);
        setModalTitleText("Remove Resident")
        setModalText("Are you sure you want to remove the resident from the apartment?")
        setModalButtonText("Remove Resident!")
        setIsRemovalModalOpen(true);
    }

    const removeCompanyAction = (companyId) => {
        setRemovalType("company")
        setTargetId(companyId);
        setModalTitleText("Remove Company")
        setModalText("Are you sure you want to remove the company from the system?")
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
                    handleAssignOwner={handleAssignOwner}
                    getExcelTemplate={getExcelTemplate}
                    uploadExcelFile={uploadExcelFile}
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
                    getCompanies={getCompanies}
                    getCompaniesByServiceType={getCompaniesByServiceType}
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
                        <div className="form-header-title">
                            <h2>Add new buildings</h2>
                        </div>
                    </div>
                    <div className="add-building-selector">
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
                </div>
            )}
        </div>
    )
}

export default ContentArea;