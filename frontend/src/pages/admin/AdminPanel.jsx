import {useContext, useEffect} from "react";

import {UserContext} from "../../context/general/UserContext.jsx";
import apiServices from "../../services/ApiServices.js";
import {AddBuildingContext} from "../../context/admin/AddBuildingContext.jsx";
import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AdminPanelContext} from "../../context/admin/AdminPanelContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";

import AddBuildingForm from "./components/AddBuildingForm.jsx";

import { IoNotifications } from "react-icons/io5";
import { IoLogOutSharp } from "react-icons/io5";
import {FaBuilding} from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";

import "./styles/AdminPanel.css";

const AdminPanel = () => {
    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const BASE_APARTMENT_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;

    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/getAll`;
    const GET_APARTMENT_URL = `${BASE_APARTMENT_API_PATH}/getByBuildingId`;

    const {
        currentView, setCurrentView,
        buildings, setBuildings,
        selectedBuilding, setSelectedBuilding,
        apartments, setApartments,
        loadingApartments, setLoadingApartments
    } = useContext(AdminPanelContext);

    const {
        currentPage, setCurrentPage,
        totalPages, setTotalPages,
        totalElements, setTotalElements,
        pageSize
    } = useContext(PaginationContext);

    const {authenticatedUserName} = useContext(UserContext);
    const {addBuildingFormData, setAddBuildingFormData} = useContext(AddBuildingContext)
    const {isLoading, setIsLoading, message, setMessage} = useContext(FeedbackContext);

    useEffect(() => {
        getAllBuildings();
    }, []);

    const handleAddBuilding = () => {
        setCurrentView('add-building');
    };

    const handleInputChange = (e) => {
        setMessage("");
        const { name, value, type } = e.target;

        const processedValue = type === 'number' ?
            (value === '' ? 0 : parseInt(value, 10)) :
            value;

        setAddBuildingFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
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
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_APARTMENT_URL}/${buildingId}?${params.toString()}`;
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

    const addBuilding = async(e) =>{

        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await apiServices.post(`${ADD_BUILDING_URL}`,addBuildingFormData);

            setAddBuildingFormData({
                numberOfFloors: 0,
                numberOfApartmentsInOneFloor: 0,
                buildingNumber: 0,
                address: '',
                overrides: [],
            });

            await getAllBuildings();

            setCurrentView('buildings');

        }catch (error){
            console.error(error.message);
            setMessage(error.message)
            setIsLoading(false);
        }finally{
            setIsLoading(false);
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

                <nav className="navigation">
                    <div className="nav-section">
                        <h4 className="nav-title">MANAGEMENT</h4>
                        <button
                            className={`nav-item ${currentView === 'buildings' ? 'active' : ''}`}
                            onClick={() => setCurrentView('buildings')}
                        >
                            <FaBuilding/> Buildings
                        </button>
                        <button className="nav-item"> <MdBusinessCenter/> Companies</button>
                    </div>
                </nav>

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

            <div className="main-content">
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
                            <IoNotifications/> <span>Notifications</span>
                        </button>
                        <button className="notification-btn">
                            <IoLogOutSharp/> <span>Log out</span>
                        </button>
                    </div>
                </header>

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
                                                {/* Show first page if not in first group */}
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

                                                {/* Show 3 pages around current page */}
                                                {[...Array(totalPages)].map((_, index) => {
                                                    // Only show pages that are within ±1 of current page
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
            </div>
        </div>
    );
};

export default AdminPanel;