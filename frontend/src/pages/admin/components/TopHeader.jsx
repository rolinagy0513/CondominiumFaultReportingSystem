import { IoNotifications } from "react-icons/io5";
import { IoLogOutSharp } from "react-icons/io5";

import "./component-styles/TopHeader.css"

const TopHeader = ({currentView, selectedBuilding, handleLogout, setIsAdminModalOpen}) =>{

    return(
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
            <button className="notification-btn" onClick={() => setIsAdminModalOpen(true)}>
                <IoNotifications/> <span>Notifications</span>
            </button>
            <button className="notification-btn" onClick={handleLogout}>
                <IoLogOutSharp/> <span>Log out</span>
            </button>
        </div>
    </header>
    )

}

export default TopHeader;