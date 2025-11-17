const PendingRequest = () => {
    return (
        <div className="pending-page">
            <div className="pending-container">
                <div className="pending-content">
                    <h1 className="pending-title">Request Pending</h1>
                    <p className="pending-text">
                        Your request is currently <strong>PENDING</strong> and is being
                        investigated by an administrator.
                    </p>
                    <div className="pending-loader">
                        <div className="loader-dot"></div>
                        <div className="loader-dot"></div>
                        <div className="loader-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PendingRequest;