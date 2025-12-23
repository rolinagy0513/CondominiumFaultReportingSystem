import {useState} from "react";

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
                         setModalText, setModalButtonText, setModalTitleText,
                         handleAssignOwner, addWithExcel, setAddWithExcel,
                         getExcelTemplate, uploadExcelFile
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

    const changeBuildingAddScreen = () =>{
        setAddWithExcel(true);
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleExcelUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadResult(null);
        }
    };

    const handleSubmitExcel = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            alert("No file selected")
            return;
        }

        setIsUploading(true);
        const result = await uploadExcelFile(selectedFile);
        setUploadResult(result);
        setIsUploading(false);

        if (result.success) {
            setSelectedFile(null);
            document.getElementById('excel-upload').value = '';
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadResult(null);
        document.getElementById('excel-upload').value = '';
    };

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
                        <div className="form-header-title">
                            <h2>{addWithExcel ? "Import Buildings from Excel" : "Add New Building"}</h2>
                        </div>
                        <div className="form-header-import-section">
                            <button className={`form-header-import-button ${addWithExcel ? 'excel-mode' : ''}`} onClick={() => addWithExcel ? setAddWithExcel(false) : changeBuildingAddScreen()}>
                                {addWithExcel ? "Add Manually" : "Import from Excel"}
                            </button>
                        </div>
                    </div>
                    <div className="add-building-selector">
                        {!addWithExcel ? (
                            <div className="building-form">
                                <AddBuildingForm
                                    handleChange={handleInputChange}
                                    handleSubmit={addBuilding}
                                    formData={addBuildingFormData}
                                    isLoading={isLoading}
                                    message={message}
                                />
                            </div>
                        ) : (
                            <div className="excel-upload-section">
                                <div className="upload-instructions">
                                    <h3>Import Buildings from Excel</h3>
                                    <p>Upload an Excel file with the wanted structure to add multiple residents at once, you can download an example excel sheet for the structure.</p>

                                    <div className="instructions-list">
                                        <h4>Requirements:</h4>
                                        <ul>
                                            <li>Use the provided template format</li>
                                            <li>Supported formats: .xlsx, .xls</li>
                                            <li>Download the template with the button, fill the fields and upload it here to add the residents at once</li>
                                            <li>Required fields: firstname, lastname, email, building number, building address, floor, apartment number</li>
                                            <li>Optional columns: Password (generated automatically)</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="upload-area">
                                    <div className="file-drop-zone">
                                        <div className="upload-icon">📊</div>
                                        <h4>Drag & Drop Excel File Here</h4>
                                        <p>or click to browse files</p>
                                        <input
                                            type="file"
                                            id="excel-upload"
                                            accept=".xlsx,.xls"
                                            className="file-input"
                                            onChange={handleExcelUpload}
                                        />
                                        <label htmlFor="excel-upload" className="browse-button">
                                            Browse Files
                                        </label>
                                    </div>

                                    {selectedFile && (
                                        <div className="file-info">
                                            <span>
                                                Selected: {selectedFile.name}
                                                ({Math.round(selectedFile.size / 1024)} KB)
                                            </span>
                                            <button
                                                className="remove-file"
                                                onClick={handleRemoveFile}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    {uploadResult && !uploadResult.success && uploadResult.error?.errors && (
                                        <div className="upload-errors">
                                            <h4>Upload Errors:</h4>
                                            {uploadResult.error.errors.map((err, index) => (
                                                <div key={index} className="error-item">
                                                    Row {err.rowNumber || 'Unknown'}: {err.errorMessage}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {uploadResult && uploadResult.success && (
                                        <div className="upload-success">
                                            <h4>✅ Upload Successful!</h4>
                                            <p>
                                                Successfully registered {uploadResult.data?.successfulRegistrations || 0} users.
                                                {uploadResult.data?.failedRegistrations ?
                                                    ` ${uploadResult.data.failedRegistrations} failed.` : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div className="download-template">
                                        <button
                                            className="download-button"
                                            onClick={getExcelTemplate}
                                        >
                                            📥 Download Excel Template
                                        </button>
                                        <p className="template-note">Use our pre-formatted template to ensure correct data structure</p>
                                    </div>
                                </div>

                                <div className="upload-actions">
                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            setAddWithExcel(false);
                                            setSelectedFile(null);
                                            setUploadResult(null);
                                        }}
                                    >
                                        ← Back to Manual Entry
                                    </button>
                                    <button
                                        className="upload-button"
                                        onClick={handleSubmitExcel}
                                        disabled={!selectedFile || isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload and Process File'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContentArea;