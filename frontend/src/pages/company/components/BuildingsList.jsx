import {useContext} from "react";
import {CompanyPageContext} from "../../../context/company/CompanyPageContext.jsx";

import "./component-styles/BuildingsList.css"

const BuildingsList = () =>{

    const {usersBuildings} = useContext(CompanyPageContext);

    return(
        <div className="company-page-buildings-section">
            <div className="company-page-buildings-card">
                <h3>Managed Buildings</h3>
                <div className="company-page-buildings-content">
                    {usersBuildings && usersBuildings.length > 0 ? (
                        <div className="company-page-buildings-list">
                            {usersBuildings.map(building => (
                                <div key={building.id} className="company-page-building-item">
                                    <h4 className="company-page-building-title">Building #{building.buildingNumber}</h4>
                                    <p className="company-page-building-address">{building.address}</p>
                                    <div className="company-page-building-info">
                                                    <span className="company-page-building-apartments">
                                                        Apartments: {building.numberOfApartments}
                                                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="company-page-no-buildings">No buildings managed</p>
                    )}
                </div>
            </div>
        </div>
    )

}

export default BuildingsList