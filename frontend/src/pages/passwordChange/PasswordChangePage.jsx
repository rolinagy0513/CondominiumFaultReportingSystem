import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import apiServices from "../../services/ApiServices.js";

import "./style/PasswordChangePage.css"
import websocketServices from "../../services/WebsocketServices.js";

const PasswordChangePage = () => {

    const USERS_API_PATH = import.meta.env.VITE_API_BASE_USERS_URL;
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;

    const CHANGE_PASSWORD_URL = `${USERS_API_PATH}/changePassword`
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmationPassword: ''
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmationPassword) {
            setError('All fields are required');
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword !== formData.confirmationPassword) {
            setError('New password and confirmation do not match');
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            setIsSubmitting(false);
            return;
        }

        if (!formData.newPassword.match(/.*\d.*/)) {
            setError('Password must contain at least one number');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await apiServices.patch(CHANGE_PASSWORD_URL, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmationPassword: formData.confirmationPassword
            });

            setPasswordChangedSuccess(true);
            setFormData({ currentPassword: '', newPassword: '', confirmationPassword: '' });
            setError('');

        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoutAndRedirect = async () => {

        try {

            await apiServices.post(LOGOUT_URL);
            navigate("/");

        }catch (error){
            console.error(error.message);
        }

    };

    if (passwordChangedSuccess) {
        return (
            <div className="password-change-page">
                <div className="password-change-success-container">
                    <div className="password-change-success-icon">
                        <div className="success-checkmark">
                            <div className="check-icon">
                                <span className="icon-line line-tip"></span>
                                <span className="icon-line line-long"></span>
                                <div className="icon-circle"></div>
                                <div className="icon-fix"></div>
                            </div>
                        </div>
                    </div>

                    <div className="password-change-success-header">
                        <h1>Password Changed Successfully!</h1>
                        <p className="password-change-success-message">
                            Your password has been updated. For security reasons,
                            please log out and log in again with your new password.
                        </p>
                    </div>

                    <div className="password-change-success-actions">
                        <button
                            onClick={handleLogoutAndRedirect}
                            className="password-change-logout-button"
                        >
                            Log Out and Log In Again
                        </button>

                        <p className="password-change-success-note">
                            <strong>Note:</strong> You won't be able to use the application
                            until you log in again with your new password.
                        </p>
                    </div>

                    <div className="password-change-security-reminder">
                        <h3>🔒 Security Reminder</h3>
                        <p>
                            Remember to keep your new password secure and don't share it with anyone.
                            If you forget your password, contact your administrator.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="password-change-page">
            <div className="password-change-container">
                <div className="password-change-header">
                    <h1>Welcome!</h1>
                    <p className="subtitle">
                        Your account was created by an administrator. For security reasons,
                        please change your temporary password to a new one.
                    </p>
                </div>

                <form className="password-change-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠</span>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="currentPassword">
                            Current Temporary Password *
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Enter your temporary password"
                            required
                            autoComplete="current-password"
                        />
                        <p className="input-hint">
                            This is the password provided in your welcome email
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">
                            New Password *
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            required
                            autoComplete="new-password"
                        />
                        <p className="input-hint">
                            Must be at least 8 characters long and contain a number
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmationPassword">
                            Confirm New Password *
                        </label>
                        <input
                            type="password"
                            id="confirmationPassword"
                            name="confirmationPassword"
                            value={formData.confirmationPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your new password"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="button-loading">
                                <span className="spinner"></span>
                                Changing Password...
                            </span>
                        ) : (
                            'Change Password'
                        )}
                    </button>

                    <div className="password-requirements">
                        <h3>Password Requirements:</h3>
                        <ul>
                            <li>Minimum 8 characters</li>
                            <li>Password must contain a number</li>
                            <li>Should not be too common or easy to guess</li>
                            <li>Consider using a mix of letters, numbers, and symbols</li>
                        </ul>
                    </div>
                </form>

                <div className="security-notice">
                    <h3>🔒 Security Notice</h3>
                    <p>
                        For your security, please choose a strong password that you haven't used
                        elsewhere. This password change is required for first-time login.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PasswordChangePage;