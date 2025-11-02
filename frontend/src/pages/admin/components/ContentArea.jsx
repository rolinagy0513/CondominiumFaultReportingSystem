import AddBuildingForm from "./AddBuildingForm.jsx";

import "./component-styles/ContentArea.css"

const ContentArea = ({
                         currentView, buildings,
                         handleBackToBuildings, apartments,
                         currentPage, pageSize,
                         totalElements, loadingApartments,
                         handlePageChange, totalPages,
                         handleInputChange, addBuilding,
                         addBuildingFormData, isLoading,
                         message
}) =>{

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