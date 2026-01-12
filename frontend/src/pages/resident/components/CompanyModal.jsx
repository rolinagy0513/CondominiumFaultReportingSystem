import {useContext} from "react";
import {ResidentCompanyContext} from "../../../context/resident/ResidentCompanyContext.jsx";
import "./components-styles/CompanyModal.css"
import {getServiceIcon, getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";

const CompanyModal = () => {
    const { expandedCompany, expandedCompanyId, setExpandedCompanyId } = useContext(ResidentCompanyContext);

    if (!expandedCompanyId) return null;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="company-modal-star-filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="company-modal-star-half">★</span>);
            } else {
                stars.push(<span key={i} className="company-modal-star-empty">★</span>);
            }
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="company-modal-overlay" onClick={() => setExpandedCompanyId(null)}>
            <div className="company-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="company-modal-header">
                    <h2 className="company-modal-title">{expandedCompany.name}</h2>
                    <button
                        className="company-modal-close-btn"
                        onClick={() => setExpandedCompanyId(null)}
                    >
                        &times;
                    </button>
                </div>

                {/* Service Type - Simple text and icon */}
                <div className="company-modal-service-name">
                    <span>{getServiceTypeDisplay(expandedCompany.serviceType)}</span>
                    <span className="company-modal-service-icon">
                        {getServiceIcon(expandedCompany.serviceType)}
                    </span>
                </div>

                <div className="company-modal-info-section">
                    <h3 className="company-modal-section-title">Company Information</h3>
                    <div className="company-modal-info-grid">
                        <div className="company-modal-info-item">
                            <span className="company-modal-info-label">Email:</span>
                            <span className="company-modal-info-value company-modal-email">
                                {expandedCompany.email}
                            </span>
                        </div>
                        <div className="company-modal-info-item">
                            <span className="company-modal-info-label">Phone:</span>
                            <span className="company-modal-info-value">
                                {expandedCompany.phoneNumber}
                            </span>
                        </div>
                        <div className="company-modal-info-item">
                            <span className="company-modal-info-label">Address:</span>
                            <span className="company-modal-info-value">
                                {expandedCompany.address}
                            </span>
                        </div>
                        <div className="company-modal-info-item">
                            <span className="company-modal-info-label">Overall Rating:</span>
                            <div className="company-modal-rating-display">
                                {expandedCompany.overallRating ? (
                                    <>
                                        <div className="company-modal-stars">
                                            {renderStars(expandedCompany.overallRating)}
                                        </div>
                                        <span className="company-modal-rating-value">
                                            {expandedCompany.overallRating.toFixed(1)}/5.0
                                        </span>
                                    </>
                                ) : (
                                    <span className="company-modal-no-rating">No ratings yet</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {expandedCompany.companyIntroduction && (
                        <div className="company-modal-introduction">
                            <h4 className="company-modal-intro-title">Introduction</h4>
                            <p className="company-modal-intro-text">{expandedCompany.companyIntroduction}</p>
                        </div>
                    )}
                </div>

                <div className="company-modal-feedbacks-section">
                    <h3 className="company-modal-section-title">
                        Customer Feedbacks ({expandedCompany.feedbacks?.length || 0})
                    </h3>
                    {expandedCompany.feedbacks && expandedCompany.feedbacks.length > 0 ? (
                        <div className="company-modal-feedbacks-list">
                            {expandedCompany.feedbacks.map((feedback, index) => (
                                <div key={index} className="company-modal-feedback-item">
                                    <div className="company-modal-feedback-header">
                                        <div className="company-modal-feedback-rating">
                                            <div className="company-modal-feedback-stars">
                                                {renderStars(feedback.rating)}
                                            </div>
                                            <span className="company-modal-feedback-rating-value">
                                                {feedback.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="company-modal-feedback-meta">
                                            <span className="company-modal-feedback-reviewer">
                                                {feedback.reviewerEmail || "Anonymous"}
                                            </span>
                                            <span className="company-modal-feedback-date">
                                                {formatDate(feedback.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    {feedback.message && (
                                        <p className="company-modal-feedback-message">
                                            {feedback.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="company-modal-no-feedbacks">
                            <p>No feedbacks available for this company yet.</p>
                        </div>
                    )}
                </div>

                <div className="company-modal-footer">
                    <button
                        className="company-modal-close-footer-btn"
                        onClick={() => setExpandedCompanyId(null)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CompanyModal;