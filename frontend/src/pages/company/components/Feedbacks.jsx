import {useContext} from "react";

import {CompanyPageContext} from "../../../context/company/CompanyPageContext.jsx";

import "./component-styles/Feedbacks.css"

const Feedbacks = () =>{

    const {usersFeedbacks} = useContext(CompanyPageContext);

    return(
        <div className="company-page-feedbacks-section">
            <h3>Customer Feedbacks</h3>
            {usersFeedbacks && usersFeedbacks.length > 0 ? (
                <div className="company-page-feedbacks-list">
                    {usersFeedbacks.map(feedback => (
                        <div key={feedback.id} className="company-page-feedback-item">
                            <div className="company-page-feedback-header">
                                <span className="company-page-feedback-rating">⭐ {feedback.rating}/5</span>
                                <span className="company-page-feedback-date">
                                              {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric'
                                              }) : 'N/A'}
                                            </span>
                            </div>
                            <p className="company-page-feedback-message">{feedback.message}</p>
                            <div className="company-page-feedback-footer">
                                <span className="company-page-feedback-author">By: {feedback.reviewerEmail}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="company-page-no-feedback">No feedbacks yet</p>
            )}
        </div>
    )

}

export default Feedbacks;