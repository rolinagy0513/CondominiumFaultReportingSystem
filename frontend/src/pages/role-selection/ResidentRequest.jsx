import BuildingsList from "../admin/components/BuildingsList.jsx";
import {useContext, useEffect, useState} from "react";
import {BuildingContext} from "../../context/admin/BuildingContext.jsx";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useApartments} from "../../hooks/useApartments.js";
import "./styles/ResidentRequest.css"

const ResidentRequest = () => {

    //Bug bug hátán
    //Valamit kell csinálni hogy rendensen megjeleníse a building-et
    //css hogy a buildings list menjen


    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL
    const APARTMENT_BASE_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;

    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_AVAILABLE_APARTMENTS_URL = `${APARTMENT_BASE_API_PATH}/getAvailableByBuildingId`;

    const {
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding
    } = useContext(BuildingContext);

    // State for apartments
    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const { getAllBuildings } = useBuildings({
        GET_ALL_BUILDING_URL,
        setBuildings,
    });

    // Use apartments hook for available apartments only
    const { getAvailableApartmentsInBuilding } = useApartments(
        '', '', GET_AVAILABLE_APARTMENTS_URL, '', '',
        pageSize, currentPage, setLoadingApartments, setApartments, setCurrentPage, setTotalPages,
        setTotalElements, buildings, setSelectedBuilding, () => {}, () => {},
        selectedBuilding, () => {}, () => {}, () => {}, () => {}, () => {}
    );

    useEffect(() => {
        getAllBuildings();
    }, []);

    const getApartments = (buildingId, page = 0) => {
        const building = buildings.find(b => b.id === buildingId);
        setSelectedBuilding(building);
        getAvailableApartmentsInBuilding(buildingId, page);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && selectedBuilding) {
            setCurrentPage(newPage);
            getApartments(selectedBuilding.id, newPage);
        }
    };

    const handleSelectApartment = (apartment) => {
        console.log("Selected apartment:", apartment);
        // Add your apartment selection logic here
        // This could open a modal, navigate to a form, etc.
    };

    return (
        <div className="resident-request-container">
            <div className="left-section">
                <div className="left-section-header">
                    <h2 className="section-title">Choose where you live or will live</h2>
                    <p className="section-subtitle">Select a building from the list below</p>
                </div>

                {buildings && buildings.length > 0 ? (
                    <BuildingsList
                        buildings={buildings}
                        getApartments={getApartments}
                        selectedBuilding={selectedBuilding}
                    />
                ) : (
                    <div className="no-buildings-message">
                        <p>No buildings available in the system</p>
                    </div>
                )}
            </div>

            <div className="middle-section">
                {selectedBuilding ? (
                    <div className="building-details">
                        <h2 className="building-name">{selectedBuilding.name}</h2>
                        <div className="building-info">
                            <p><strong>Address:</strong> {selectedBuilding.address || 'N/A'}</p>
                        </div>

                        <div className="apartments-section">
                            <div className="apartments-header">
                                <h3 className="apartments-title">Available Apartments</h3>
                                <p className="pagination-info">
                                    Showing {apartments.length > 0 ? (currentPage * pageSize + 1) : 0} -{' '}
                                    {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} apartments
                                </p>
                            </div>

                            <div className="apartments-list">
                                {loadingApartments ? (
                                    <div className="loading-message">Loading apartments...</div>
                                ) : apartments && apartments.length > 0 ? (
                                    <>
                                        {apartments.map(apartment => (
                                            <div key={apartment.id} className="apartment-item">
                                                <div className="apartment-info">
                                                    <h4>Apartment {apartment.apartmentNumber}</h4>
                                                    <p><strong>Floor:</strong> {apartment.floorNumber || 'N/A'}</p>
                                                </div>
                                                <button
                                                    className="select-apartment-btn"
                                                    onClick={() => handleSelectApartment(apartment)}
                                                >
                                                    Select Apartment
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="no-apartments-message">
                                        No available apartments in this building
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
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
                        </div>
                    </div>
                ) : (
                    <div className="no-selection-message">
                        <p>Click on one of the buildings to view available apartments</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResidentRequest