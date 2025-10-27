import {useContext, useState} from "react";
import "./styles/AdminPanel.css";
import {AuthContext} from "../../context/AuthContext.jsx";
import {UserContext} from "../../context/UserContext.jsx";

const AdminPanel = () => {
    const ADMIN_BUILDING_API_PATH = import.meta.env.VITE_API_ADMIN_BUILDING_URL;
    const ADD_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/addNew`;
    const GET_ALL_BUILDING_URL = `${ADMIN_BUILDING_API_PATH}/getAll`;

    const [currentView, setCurrentView] = useState('buildings');
    const [user] = useState({
        name: 'Admin User',
        role: 'Administrator'
    });

    const {authenticatedUserName} = useContext(UserContext);

    //Ide kell majd meghívni az api-t ami visszaadja az összes building-et
    //Ez után meg kell csinálni az add funkciót amihez kell egy új custom form
    //websocket subscription
    const [buildings] = useState([
        { id: 1, name: 'Building A', address: '123 Main St' },
        { id: 2, name: 'Building B', address: '456 Oak Ave' },
        { id: 3, name: 'Building C', address: '789 Pine Rd' }
    ]);

    const handleAddBuilding = () => {
        setCurrentView('add-building');
    };

    const handleBackToBuildings = () => {
        setCurrentView('buildings');
    };

    return (
        <div className="admin-panel">
            {/* Left Sidebar */}
            <div className="sidebar">
                {/* User Info */}
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
                            <div key={building.id} className="building-item">
                                <div className="building-icon">🏢</div>
                                <div className="building-info">
                                    <div className="building-name">{building.name}</div>
                                    <div className="building-address">{building.address}</div>
                                </div>
                            </div>
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
                            {currentView === 'buildings' ? 'Building Management' : 'Add New Building'}
                        </h1>
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
                                <p>Select a building from the sidebar or add a new one.</p>
                            </div>
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