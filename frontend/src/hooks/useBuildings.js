import apiServices from "../services/ApiServices.js";
import {BuildingContext} from "../context/admin/BuildingContext.jsx";
import {FeedbackContext} from "../context/general/FeedbackContext.jsx";
import {AddBuildingContext} from "../context/admin/AddBuildingContext.jsx";
import {AdminPanelContext} from "../context/admin/AdminPanelContext.jsx";

import {useContext} from "react";
import {ResidentPageContext} from "../context/resident/ResidentPageContext.jsx";
import {ResidentBuildingContext} from "../context/resident/ResidentBuildingContext.jsx";
import {ResidentApartmentContext} from "../context/resident/ResidentApartmentContext.jsx";
import {CompanyPageContext} from "../context/company/CompanyPageContext.jsx";

export const useBuildings = () =>{

    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const RESIDENT_BUILDING_API_PATH = import.meta.env.VITE_API_RESIDENT_BUILDING_URL
    const BUILDING_API_PATH = import.meta.env.VITE_API_BASE_BUILDING_URL

    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${BUILDING_API_PATH}/getAll`;
    const GET_BY_APARTMENT_ID_URL = `${RESIDENT_BUILDING_API_PATH}/getBuildingByApartmentId`

    const{
        setBuildings
    } = useContext(BuildingContext);

    const {
        setIsLoading, setMessage
    } = useContext(FeedbackContext);

    const {
        addBuildingFormData, setAddBuildingFormData
    } = useContext(AddBuildingContext);

    const {
        setCurrentView,
    } = useContext(AdminPanelContext);

    const {
        ownersApartmentId
    } = useContext(ResidentApartmentContext);

    const {
        setOwnersBuilding, setOwnersBuildingId
    } = useContext(ResidentBuildingContext);

    const {
        setUsersBuildings
    } = useContext(CompanyPageContext);

    const getAllBuildings = async() => {
        try {
            const response = await apiServices.get(GET_ALL_BUILDING_URL);
            setBuildings(response);
        } catch (error) {
            console.error(error.message);
        }
    }

    const addBuilding = async() =>{

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

    const getBuildingByApartmentId = async () => {

        try {
            const response = await apiServices.get(`${GET_BY_APARTMENT_ID_URL}/${ownersApartmentId}`)
            setOwnersBuilding(response);
            setOwnersBuildingId(response.id)
        }catch (error){
            console.error(error.message);
        }
    }

    const getBuildingsByCompanyId = async (companyId) =>{

        try {
            const response = await apiServices.get(`/api/company/building/getBuildingsByCompanyId/${companyId}`)
            setUsersBuildings(response);
        }catch (error){
            console.error(error.message);
        }

    }

    return {getAllBuildings, addBuilding, getBuildingByApartmentId, getBuildingsByCompanyId};

}
