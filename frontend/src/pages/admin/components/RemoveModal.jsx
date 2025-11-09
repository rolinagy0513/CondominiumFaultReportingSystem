import "./component-styles/RemoveModal.css"

const RemovalModal = ({
                          targetApartmentId,
                          isRemovalModalOpen,
                          setIsRemovalModalOpen,
                          handleRemoveResidentFromApartment
                      }) => {

    if (!isRemovalModalOpen) return null;

    console.log(targetApartmentId);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsRemovalModalOpen(false);
        }
    };

    const onClose = () => {
        setIsRemovalModalOpen(false);
    };

    return (
        <div className="removal-modal-backdrop" onClick={handleBackdropClick}>
            <div className="removal-modal">
                <div className="removal-modal-header">
                    <h3>Remove Resident</h3>
                    <button
                        className="removal-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="removal-modal-content">
                    <div className="warning-icon">⚠️</div>

                    <div className="removal-modal-message">
                        <p>Are you sure you want to remove the resident from this apartment?</p>

                        <p className="warning-text">
                            This action cannot be undone. The resident will lose access to the apartment.
                        </p>
                    </div>
                </div>

                <div className="removal-modal-actions">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="remove-btn"
                        onClick={() => handleRemoveResidentFromApartment(targetApartmentId)}
                    >
                        Remove Resident
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemovalModal;