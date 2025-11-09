import {FaBuilding} from "react-icons/fa6";
import {MdBusinessCenter} from "react-icons/md";

import BuildingsList from "./BuildingsList.jsx";

import "./component-styles/SideBar.css"

const SideBar = ({authenticatedAdminUserName, currentView,
                     setCurrentView, handleAddBuilding,
                     buildings, getApartments, selectedBuilding,
                     getCompanies
}) =>{

    return(
        <div className="sidebar">
            <div className="user-section">
                <div className="user-avatar">
                    <div className="avatar-placeholder">
                        {authenticatedAdminUserName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="user-info">
                    <h3 className="user-name">{authenticatedAdminUserName}</h3>
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
                    <button className="nav-item" onClick={()=> getCompanies(0)}> <MdBusinessCenter/> Companies</button>
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
                <BuildingsList
                    buildings={buildings}
                    getApartments={getApartments}
                    selectedBuilding={selectedBuilding}
                />
            </div>
        </div>
    )

}

export default SideBar;