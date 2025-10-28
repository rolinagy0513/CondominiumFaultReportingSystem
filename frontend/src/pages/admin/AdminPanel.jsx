import {useContext, useEffect, useState} from "react";
import "./styles/AdminPanel.css";
import {UserContext} from "../../context/UserContext.jsx";
import apiServices from "../../services/ApiServices.js";

const AdminPanel = () => {
    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const BASE_APARTMENT_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;

    //Tudod te

    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/getAll`;
    const GET_APARTMENT_URL = `${BASE_APARTMENT_API_PATH}/getByBuildingId`;

    const [currentView, setCurrentView] = useState('buildings');
    const {authenticatedUserName} = useContext(UserContext);

    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [loadingApartments, setLoadingApartments] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        getAllBuildings();
    }, []);

    const handleAddBuilding = () => {
        setCurrentView('add-building');
    };

    const handleBackToBuildings = () => {
        setCurrentView('buildings');
        setSelectedBuilding(null);
        setApartments([]);
        setCurrentPage(0);
        setTotalPages(0);
    };

    const getAllBuildings = async() => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
            console.log("The fetched buildings:");
            console.log(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const getApartments = async(buildingId, page = 0) => {
        setLoadingApartments(true);
        try {
            // Build URL with pagination parameters
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_APARTMENT_URL}/${buildingId}?${params.toString()}`;
            const response = await apiServices.get(url);

            console.log("Apartments response:", response);

            // Handle Spring Page response
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
            setCurrentView('apartments');
        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const handlePageChange = (newPage) => {
        if (selectedBuilding && newPage >= 0 && newPage < totalPages) {
            getApartments(selectedBuilding.id, newPage);
        }
    };

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <div className="user-section">
                    <div className="user-avatar">
                        <div className="avatar-placeholder">
                            {authenticatedUserName.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                    <div className="user-info">
                        <h3 className="user-name">{authenticatedUserName}</h3>
                        <p className="user-role">Administrator</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="navigation">
                    <div className="nav-section">
                        <h4 className="nav-title">MANAGEMENT</h4>
                        <button
                            className={`nav-item ${currentView === 'buildings' ? 'active' : ''}`}
                            onClick={() => setCurrentView('buildings')}
                        >
                            🏢 Buildings
                        </button>
                        <button className="nav-item">👥 Residents</button>
                        <button className="nav-item">🔧 Reports</button>
                    </div>
                </nav>

                {/* Buildings List */}
                <div className="buildings-section">
                    <div className="section-header">
                        <h4 className="section-title">BUILDINGS</h4>
                        <button
                            className="add-building-btn"
                            onClick={handleAddBuilding}
                        >
                            + Add New
                        </button>
                    </div>
                    <div className="buildings-list">
                        {buildings.map(building => (
                            <button
                                key={building.id}
                                className={`building-item ${selectedBuilding?.id === building.id ? 'selected' : ''}`}
                                onClick={() => getApartments(building.id)}
                            >
                                <div className="building-icon">🏢</div>
                                <div className="building-info">
                                    <div className="building-name">Building {building.buildingNumber}</div>
                                    <div className="building-address">{building.address}</div>
                                    <div className="building-apartments">{building.numberOfApartments} apartments</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {currentView === 'buildings' && 'Building Management'}
                            {currentView === 'add-building' && 'Add New Building'}
                            {currentView === 'apartments' && `Apartments - Building ${selectedBuilding?.buildingNumber}`}
                        </h1>
                        {currentView === 'apartments' && (
                            <p className="building-address">{selectedBuilding?.address}</p>
                        )}
                    </div>
                    <div className="header-right">
                        <button className="notification-btn">
                            🔔 Notifications
                        </button>
                        <button className="notification-btn">
                            ⚙️ Settings
                        </button>
                    </div>
                </header>

                {/* Content Area */}
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

                                    {/* Pagination Controls */}
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
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        className={`pagination-page ${currentPage === index ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
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
                                <div className="form-placeholder">
                                    <h3>Building Information Form</h3>
                                    <p>This is where the building form will be displayed.</p>
                                    <div className="form-fields">
                                        <div className="field">Building Number Input</div>
                                        <div className="field">Address Input</div>
                                        <div className="field">Floors Input</div>
                                        <div className="field">Apartments per Floor Input</div>
                                        <div className="field">Floor Overrides Section</div>
                                    </div>
                                    <button className="submit-button">
                                        Create Building
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;