import { useState } from 'react';

import {FaBuilding} from "react-icons/fa6";
import {MdBusinessCenter} from "react-icons/md";

import "./styles/ChooseRole.css"

const ChooseRole = () => {
    const [hoveredSide, setHoveredSide] = useState(null);

    return (
        <div className="role-selection-container">
            <div className="center-title">
                <h1>Choose Your Plan!</h1>
                <div className="title-decoration"></div>
            </div>

            <div className="roles-wrapper">
                <div
                    className={`role-card resident-side ${hoveredSide === 'resident' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredSide('resident')}
                    onMouseLeave={() => setHoveredSide(null)}
                >
                    <div className="role-content">
                        <div className="icon-wrapper">
                            <div className="resident-icon"><FaBuilding/></div>
                        </div>
                        <h2>Are you a new resident?</h2>
                        <p>Join our community and discover amazing local services tailored just for you!</p>
                        <button className="role-btn resident-btn">
                            Join as Resident
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                    <div className="card-glow"></div>
                </div>

                <div className="vertical-divider">
                    <div className="divider-line"></div>
                    <div className="divider-text">OR</div>
                    <div className="divider-line"></div>
                </div>

                <div
                    className={`role-card company-side ${hoveredSide === 'company' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredSide('company')}
                    onMouseLeave={() => setHoveredSide(null)}
                >
                    <div className="role-content">
                        <div className="icon-wrapper">
                            <div className="company-icon"><MdBusinessCenter/></div>
                        </div>
                        <h2>Request to be a company</h2>
                        <p>Expand your business reach and connect with potential customers in our platform!</p>
                        <button className="role-btn company-btn">
                            Register Company
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                    <div className="card-glow"></div>
                </div>
            </div>
        </div>
    );
};

export default ChooseRole;