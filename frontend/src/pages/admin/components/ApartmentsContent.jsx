import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import "./component-styles/ApartmentsContent.css"

const ApartmentsContent = ({
                               handleBackToBuildings,
                               currentPage, pageSize,
                               totalElements, loadingApartments, apartments,
                               removeResidentAction, totalPages,
                               handlePageChange, handleAssignOwner,
                               getExcelTemplate,uploadExcelFile
                           }) => {

    const [emailInputs, setEmailInputs] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [addWithExcel, setAddWithExcel] = useState(false);

    const handleEmailChange = (apartmentId, value) => {
        setEmailInputs(prev => ({
            ...prev,
            [apartmentId]: value
        }));
    };

    const handleAssignOwnerClick = async (apartmentId) => {
        const userEmail = emailInputs[apartmentId];

        if (!userEmail) {
            alert("Please enter an email address");
            return;
        }

        try {
            await handleAssignOwner(apartmentId, userEmail);
            setEmailInputs(prev => ({
                ...prev,
                [apartmentId]: ''
            }));
        } catch (error) {
            alert("Failed to assign owner. Please try again.");
        }
    };

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

    return (
        <div className="apartments-content">
            <div className="content-header">
                <h3>{addWithExcel ? "Import Apartments from Excel" : "Apartments List"}</h3>
                {!addWithExcel && (
                    <p className="pagination-info">
                        Showing {apartments.length > 0 ? (currentPage * pageSize + 1) : 0} - {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} apartments
                    </p>
                )}
                <button
                    className="apartments-content-excel-import-button"
                    onClick={() => setAddWithExcel(!addWithExcel)}
                >
                    {addWithExcel ? "Go back to apartments" : "Import from excel"}
                </button>
            </div>

            {addWithExcel ? (
                <div className="excel-upload-section">
                    <div className="upload-instructions">
                        <h3>Import Apartments from Excel</h3>
                        <p>Upload an Excel file with the wanted structure to add multiple apartments at once, you can download an example excel sheet for the structure.</p>

                        <div className="instructions-list">
                            <h4>Requirements:</h4>
                            <ul>
                                <li>Use the provided template format</li>
                                <li>Supported formats: .xlsx, .xls</li>
                                <li>Download the template with the button, fill the fields and upload it here to add the apartments at once</li>
                                <li>Required fields: building number, building address, floor, apartment number</li>
                                <li>Optional columns: owner email</li>
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
                                    Successfully added {uploadResult.data?.successfulRegistrations || 0} apartments.
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
                            ← Back to Apartments List
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
            ) : loadingApartments ? (
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
                                        {apartment.status === "AVAILABLE" && (
                                            <div className="assign-owner-section">
                                                <input
                                                    type="email"
                                                    placeholder="Enter user email"
                                                    value={emailInputs[apartment.id] || ''}
                                                    onChange={(e) => handleEmailChange(apartment.id, e.target.value)}
                                                    className="email-input"
                                                />
                                                <button
                                                    className="assign-owner-button"
                                                    onClick={() => handleAssignOwnerClick(apartment.id)}
                                                >
                                                    <IoMdAdd/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {apartment.ownerName && (
                                        <button
                                            className="remove-button"
                                            onClick={() => removeResidentAction(apartment.id)}
                                        >
                                            Remove Resident
                                        </button>
                                    )}
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
    )
}

export default ApartmentsContent;