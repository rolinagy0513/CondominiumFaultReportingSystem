import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";
import {InvoiceContext} from "../../../context/invoice/InvoiceContext.jsx";

import {useFeedback} from "../../../hooks/useFeedback.js";

import "./components-styles/CompletedReportModal.css"
import {ResidentBuildingContext} from "../../../context/resident/ResidentBuildingContext.jsx";

const CompletedReportModal = () => {
    const {
        completedReports, completeReportModalOpen,
        setCompleteReportModalOpen
    } = useContext(ResidentReportContext);

    const {ownersBuilding} = useContext(ResidentBuildingContext);

    const { sendFeedback } = useFeedback();

    const {
        setInvoiceNumber, setCustomerName,
        setBuildingNumber, setRoomNumber,
        setCompanyName, setReportName,
        setCost
    } = useContext(InvoiceContext);

    const [feedbackStates, setFeedbackStates] = useState({});

    const navigate = useNavigate();

    if (!completeReportModalOpen) return null;

    const toggleFeedback = (index) => {
        setFeedbackStates(prev => ({
            ...prev,
            [index]: {
                isOpen: !prev[index]?.isOpen,
                rating: prev[index]?.rating || 0,
                hoveredRating: prev[index]?.hoveredRating || 0,
                message: prev[index]?.message || ""
            }
        }));
    };

    const handleStarClick = (index, starValue) => {
        setFeedbackStates(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                rating: starValue
            }
        }));
    };

    const handleStarHover = (index, starValue) => {
        setFeedbackStates(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                hoveredRating: starValue
            }
        }));
    };

    const handleMessageChange = (index, message) => {
        setFeedbackStates(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                message: message
            }
        }));
    };

    const handleFeedbackSubmit = async (index) => {
        const feedbackData = feedbackStates[index];
        const report = completedReports[index];

        const reportId = report.id || report.reportId || report._id;

        console.log(`Submitting feedback for report ID: ${reportId}`, report);

        if (!feedbackData || feedbackData.rating === 0) {
            alert("Please select a rating before submitting");
            return;
        }

        if (!reportId) {
            alert("Error: Report ID is missing. Please contact support.");
            console.error("Report object missing ID:", report);
            return;
        }

        try {

            await sendFeedback(reportId, feedbackData.rating, feedbackData.message || "");

            setFeedbackStates(prev => ({
                ...prev,
                [index]: {
                    isOpen: false,
                    rating: 0,
                    hoveredRating: 0,
                    message: ""
                }
            }));

        } catch (error) {
            console.error("Failed to submit feedback:", error);
        }
    };

    const handleProceedToPayment = (report) => {
        setInvoiceNumber(`INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
        setCustomerName(report.residentName);
        setBuildingNumber(ownersBuilding?.buildingNumber || report.buildingNumber || 0);
        setRoomNumber(report.roomNumber);
        setCompanyName(report.companyName || "Condominium Management");
        setReportName(report.reportName);
        setCost(report.cost || 0);

        // Navigate to payment page
        navigate("/payment-page");
    };

    const renderStars = (index) => {
        const feedbackState = feedbackStates[index] || { rating: 0, hoveredRating: 0 };
        const displayRating = feedbackState.hoveredRating || feedbackState.rating;

        return Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            const isFull = starNumber <= displayRating;
            const isHalf = starNumber - 0.5 === displayRating;

            return (
                <div
                    key={starNumber}
                    className="feedback-star-container"
                    onClick={() => handleStarClick(index, starNumber)}
                    onMouseEnter={() => handleStarHover(index, starNumber)}
                    onMouseLeave={() => handleStarHover(index, 0)}
                >
                    <svg
                        className="feedback-star"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id={`star-gradient-${index}-${starNumber}`} x1="0%" x2="100%">
                                <stop offset="0%" stopColor={isHalf ? "#fbbf24" : (isFull ? "#fbbf24" : "transparent")} />
                                <stop offset="50%" stopColor={isHalf ? "#fbbf24" : (isFull ? "#fbbf24" : "transparent")} />
                                <stop offset="50%" stopColor={isFull ? "#fbbf24" : "transparent"} />
                                <stop offset="100%" stopColor={isFull ? "#fbbf24" : "transparent"} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill={`url(#star-gradient-${index}-${starNumber})`}
                            stroke="#fbbf24"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            );
        });
    };

    return(
        <div className="resident-page-complete-modal-overlay">
            <div className="resident-page-complete-modal-content">
                <div className="resident-page-complete-modal-header">
                    <h3>Completed Reports</h3>
                    <button onClick={() => setCompleteReportModalOpen(false)}>X</button>
                </div>

                <div className="resident-page-completed-reports">
                    {completedReports.length === 0 ? (
                        <div className="resident-page-complete-empty-state">
                            <p>No completed reports yet</p>
                        </div>
                    ) : (
                        completedReports.map((report, index) => (
                            <div key={index} className="resident-page-complete-report-card">
                                <div className="resident-page-complete-report-header">
                                    <div className="resident-page-complete-report-title-section">
                                        <h4>{report.reportName}</h4>
                                    </div>
                                </div>

                                <div className="resident-page-complete-report-details">
                                    <div className="resident-page-complete-report-row">
                                        <div className="resident-page-complete-report-field">
                                            <strong>Sender:</strong> {report.residentName}
                                        </div>
                                        <div className="resident-page-complete-report-field">
                                            <strong>Location:</strong> Floor: {report.floorNumber} Room: {report.roomNumber}
                                        </div>
                                        <div className="resident-page-complete-report-cost">
                                            <strong>Cost:</strong> ${report.cost}
                                        </div>
                                    </div>

                                    <div className="resident-page-complete-report-row">
                                        <div className="resident-page-complete-report-field">
                                            <strong>Company:</strong> {report.companyName || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="resident-page-complete-report-actions">
                                    <button
                                        className="resident-page-complete-pay-feedback-btn"
                                        onClick={() => handleProceedToPayment(report)}
                                    >
                                        💳 Proceed to Payment
                                    </button>
                                    <button
                                        className="resident-page-complete-feedback-toggle-btn"
                                        onClick={() => toggleFeedback(index)}
                                    >
                                        {feedbackStates[index]?.isOpen ? "✕ Close Feedback" : "⭐ Give Feedback"}
                                    </button>
                                </div>

                                {feedbackStates[index]?.isOpen && (
                                    <div className="resident-page-feedback-section">
                                        <div className="resident-page-feedback-divider"></div>

                                        <div className="resident-page-feedback-content">
                                            <h5 className="resident-page-feedback-title">Share Your Feedback</h5>

                                            <div className="resident-page-feedback-rating">
                                                <label>Rate your experience:</label>
                                                <div className="feedback-stars">
                                                    {renderStars(index)}
                                                </div>
                                                <p className="feedback-rating-value">
                                                    {feedbackStates[index]?.rating > 0
                                                        ? `${feedbackStates[index].rating} out of 5 stars`
                                                        : "Click to rate"}
                                                </p>
                                            </div>

                                            <div className="resident-page-feedback-message">
                                                <label htmlFor={`feedback-message-${index}`}>Your feedback (optional):</label>
                                                <textarea
                                                    id={`feedback-message-${index}`}
                                                    className="resident-page-feedback-textarea"
                                                    placeholder="Tell us about your experience..."
                                                    value={feedbackStates[index]?.message || ""}
                                                    onChange={(e) => handleMessageChange(index, e.target.value)}
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="resident-page-feedback-submit">
                                                <button
                                                    className="resident-page-feedback-submit-btn"
                                                    onClick={() => handleFeedbackSubmit(index)}
                                                >
                                                    Submit Feedback
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CompletedReportModal;