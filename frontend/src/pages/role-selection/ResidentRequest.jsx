import BuildingsList from "../admin/components/BuildingsList.jsx";
import {useContext, useEffect, useState} from "react";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useApartments} from "../../hooks/useApartments.js";
import "./styles/ResidentRequest.css"
import {RoleSelectionContext} from "../../context/role-selection/RoleSelectionContext.jsx";
import apiServices from "../../services/ApiServices.js";

//A saját que-ra fel kell iratkoztatni
// meg kell hívni a websocketes endpoint-ot
//Ha ez megvan akkor valami screen jöjjön elő, vagy log-out
//Company ugyan ez

const ResidentRequest = () => {

    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL
    const APARTMENT_BASE_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;

    const SEND_APARTMENT_REQUEST = import.meta.env.VITE_API_WEBSOCKET_APARTMENT_REQUEST_SEND_DESTINATION;

    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_AVAILABLE_APARTMENTS_URL = `${APARTMENT_BASE_API_PATH}/getAvailableByBuildingId`;

    const{
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding,
        apartments, setApartments,
        loadingApartments, setLoadingApartments,
        currentPage, setCurrentPage,
        totalPages, setTotalPages,
        totalElements, setTotalElements,
        pageSize
    } = useContext(RoleSelectionContext);

    useEffect(() => {
        getAllBuildings();
    }, []);

    const getAllBuildings = async() => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handlePageChange = (newPage) => {
        if (selectedBuilding && newPage >= 0 && newPage < totalPages) {
            getAvailableApartmentsInBuilding(selectedBuilding.id, newPage);
        }
    };

    const getAvailableApartmentsInBuilding = async(buildingId, page = 0) => {
        setLoadingApartments(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_AVAILABLE_APARTMENTS_URL}/${buildingId}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setApartments(response.content);
                setCurrentPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setApartments([]);
                setCurrentPage(0);
                setTotalPages(0);
                setTotalElements(0);
            }

            const building = buildings.find(b => b.id === buildingId);
            setSelectedBuilding(building);

        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const handleSelectApartment = (buildingId, buildingNumber, requestedApartmentId) => {

        const responseData = ({
            buildingId: buildingId,
            buildingNumber: buildingNumber,
            requestedApartmentId: requestedApartmentId
        })

    };

    return (
        <div className="resident-request-container-resident">
            <div className="left-section-resident">
                <div className="left-section-header-resident">
                    <h2 className="section-title-resident">Choose where you will live</h2>
                    <p className="section-subtitle-resident">Select a building from the list below</p>
                </div>

                {buildings && buildings.length > 0 ? (
                    <BuildingsList
                        buildings={buildings}
                        getApartments={getAvailableApartmentsInBuilding}
                        selectedBuilding={selectedBuilding}
                    />
                ) : (
                    <div className="no-buildings-message-resident">
                        <p>No buildings available in the system</p>
                    </div>
                )}
            </div>

            <div className="middle-section-resident">
                {selectedBuilding ? (
                    <div className="building-details-resident">
                        <h2 className="building-name-resident">{selectedBuilding.name}</h2>
                        <div className="building-info-resident">
                            <p><strong>Address:</strong> {selectedBuilding.address || 'N/A'}</p>
                        </div>

                        <div className="apartments-section-resident">
                            <div className="apartments-header-resident">
                                <h3 className="apartments-title-resident">Available Apartments</h3>
                                <p className="pagination-info-resident">
                                    Showing {apartments.length > 0 ? (currentPage * pageSize + 1) : 0} -{' '}
                                    {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} apartments
                                </p>
                            </div>

                            <div className="apartments-list-resident">
                                {loadingApartments ? (
                                    <div className="loading-message-resident">Loading apartments...</div>
                                ) : apartments && apartments.length > 0 ? (
                                    <>
                                        {apartments.map(apartment => (
                                            <div key={apartment.id} className="apartment-item-resident">
                                                <div className="apartment-info-resident">
                                                    <h4>Apartment {apartment.apartmentNumber}</h4>
                                                    <p><strong>Floor:</strong> {apartment.floorNumber || 'N/A'}</p>
                                                </div>
                                                <button
                                                    className="select-apartment-btn-resident"
                                                    onClick={() => handleSelectApartment(apartment)}
                                                >
                                                    Select Apartment
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="no-apartments-message-resident">
                                        No available apartments in this building
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-resident">
                                    <button
                                        className="pagination-btn-resident"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                    >
                                        ← Previous
                                    </button>

                                    <div className="pagination-pages-resident">
                                        {currentPage >= 3 && (
                                            <>
                                                <button
                                                    className="pagination-page-resident"
                                                    onClick={() => handlePageChange(0)}
                                                >
                                                    1
                                                </button>
                                                {currentPage > 3 && <span className="pagination-ellipsis-resident">...</span>}
                                            </>
                                        )}

                                        {[...Array(totalPages)].map((_, index) => {
                                            if (index >= currentPage - 1 && index <= currentPage + 1 && index >= 0 && index < totalPages) {
                                                return (
                                                    <button
                                                        key={index}
                                                        className={`pagination-page-resident ${currentPage === index ? 'active-resident' : ''}`}
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
                                                {currentPage < totalPages - 4 && <span className="pagination-ellipsis-resident">...</span>}
                                                <button
                                                    className="pagination-page-resident"
                                                    onClick={() => handlePageChange(totalPages - 1)}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        className="pagination-btn-resident"
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
                    <div className="no-selection-message-resident">
                        <p>Click on one of the buildings to view available apartments</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResidentRequest