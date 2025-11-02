import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {UserContext} from "../../context/general/UserContext.jsx";
import apiServices from "../../services/ApiServices.js";
import {AddBuildingContext} from "../../context/admin/AddBuildingContext.jsx";
import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AdminPanelContext} from "../../context/admin/AdminPanelContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";
import {AdminModalContext} from "../../context/admin/AdminModalContext.jsx";

import SideBar from "./components/SideBar.jsx";
import TopHeader from "./components/TopHeader.jsx";
import ContentArea from "./components/ContentArea.jsx";
import NotificationModal from "./components/NotificationModal.jsx";

import "./styles/AdminPanel.css";

const AdminPanel = () => {
    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const BASE_APARTMENT_API_PATH = import.meta.env.VITE_API_BASE_APARTMENT_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`
    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/getAll`;
    const GET_APARTMENT_URL = `${BASE_APARTMENT_API_PATH}/getByBuildingId`;

    const navigate = useNavigate();

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
    const {isAdminModalOpen, setIsAdminModalOpen} = useContext(AdminModalContext);

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

    const handleLogout = async () =>{

        try {

            await apiServices.post(LOGOUT_URL);
            localStorage.removeItem("authenticatedUserId");
            localStorage.removeItem("authenticatedUserName");

            navigate("/");

        }catch (error){
            console.error(error.message);
        }

    }

    return (
        <div className="admin-panel">

            <SideBar
            authenticatedUserName={authenticatedUserName}
            currentView={currentView}
            setCurrentView={setCurrentView}
            handleAddBuilding={handleAddBuilding}
            buildings={buildings}
            getApartments={getApartments}
            selectedBuilding={selectedBuilding}
            />

            <div className="main-content">

                <TopHeader
                currentView={currentView}
                selectedBuilding={selectedBuilding}
                handleLogout={handleLogout}
                setIsAdminModalOpen={setIsAdminModalOpen}
                />

                <ContentArea
                currentView={currentView}
                buildings={buildings}
                handleBackToBuildings={handleBackToBuildings}
                apartments={apartments}
                currentPage={currentPage}
                pageSize={pageSize}
                totalElements={totalElements}
                loadingApartments={loadingApartments}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
                handleInputChange={handleInputChange}
                addBuilding={addBuilding}
                addBuildingFormData={addBuildingFormData}
                isLoading={isLoading}
                message={message}
                />

            </div>

            <div>
                {isAdminModalOpen && <NotificationModal setIsAdminModalOpen={setIsAdminModalOpen} />}
            </div>

        </div>
    );
};

export default AdminPanel;