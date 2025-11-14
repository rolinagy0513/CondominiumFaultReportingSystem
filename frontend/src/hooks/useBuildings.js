import apiServices from "../services/ApiServices.js";

export const useBuildings = (
    GET_ALL_BUILDING_URL, ADD_BUILDING_URL,
    setBuildings, setIsLoading,
    addBuildingFormData, setAddBuildingFormData,
    setMessage, setCurrentView
) =>{

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

    return {getAllBuildings, addBuilding };

}
