import "./component-styles/RemoveModal.css"

const RemovalModal = ({
                          targetId,
                          isRemovalModalOpen,
                          setIsRemovalModalOpen,
                          handleRemoveFunction,
                          text
                      }) => {

    if (!isRemovalModalOpen) return null;

    console.log("THERE IS THE ID INSIDE REMOVE MODAL")
    console.log(targetId);

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
                        <p>{text}</p>

                        <p className="warning-text">
                            This action cannot be undone. The user will lose access to their privileges.
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
                        onClick={() => handleRemoveFunction(targetId)}
                    >
                        Remove Resident
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemovalModal;