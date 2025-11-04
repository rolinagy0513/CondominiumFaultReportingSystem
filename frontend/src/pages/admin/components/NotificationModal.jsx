import "./component-styles/NotificationModal.css";

const NotificationModal = ({ setIsAdminModalOpen }) => {

    //Hozzá kell adni a logikát
    //Hova menjen a company és hova az apartment request

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsAdminModalOpen(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="notification-modal">
                <div className="modal-header">
                    <h2>Notifications</h2>
                    <button
                        className="close-button"
                        onClick={() => setIsAdminModalOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    <div className="notification-section">
                        <h3>Apartment Notifications</h3>
                        <div className="notification-list">
                            <div className="notification-item placeholder">
                                <div className="notification-icon">🏢</div>
                                <div className="notification-text">
                                    <p className="notification-title">New Maintenance Request</p>
                                    <p className="notification-description">
                                        Apartment 101 submitted a maintenance request for plumbing issues.
                                    </p>
                                    <span className="notification-time">2 hours ago</span>
                                </div>
                            </div>

                            <div className="notification-item placeholder">
                                <div className="notification-icon">🔑</div>
                                <div className="notification-text">
                                    <p className="notification-title">Rent Payment Received</p>
                                    <p className="notification-description">
                                        Rent payment for Apartment 205 has been processed successfully.
                                    </p>
                                    <span className="notification-time">1 day ago</span>
                                </div>
                            </div>

                            <div className="notification-item placeholder">
                                <div className="notification-icon">⚠️</div>
                                <div className="notification-text">
                                    <p className="notification-title">Late Payment Notice</p>
                                    <p className="notification-description">
                                        Rent payment for Apartment 304 is overdue by 5 days.
                                    </p>
                                    <span className="notification-time">3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="notification-section">
                        <h3>Company Notifications</h3>
                        <div className="notification-list">
                            <div className="notification-item placeholder">
                                <div className="notification-icon">📊</div>
                                <div className="notification-text">
                                    <p className="notification-title">Monthly Report Available</p>
                                    <p className="notification-description">
                                        The monthly financial report for March is now available for review.
                                    </p>
                                    <span className="notification-time">1 week ago</span>
                                </div>
                            </div>

                            <div className="notification-item placeholder">
                                <div className="notification-icon">🛠️</div>
                                <div className="notification-text">
                                    <p className="notification-title">System Maintenance</p>
                                    <p className="notification-description">
                                        Scheduled system maintenance will occur this Sunday from 2-4 AM.
                                    </p>
                                    <span className="notification-time">2 weeks ago</span>
                                </div>
                            </div>

                            <div className="notification-item placeholder">
                                <div className="notification-icon">📋</div>
                                <div className="notification-text">
                                    <p className="notification-title">Policy Update</p>
                                    <p className="notification-description">
                                        New company policies have been updated. Please review when available.
                                    </p>
                                    <span className="notification-time">1 month ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;