import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import "./Login.css";
import api from "./api";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError(false);

        try {
            const response = await api.post("token/", {
                username,
                password,
            });

            localStorage.setItem(
                "access_token",
                response.data.access
            );

            localStorage.setItem(
                "refresh_token",
                response.data.refresh
            );

            localStorage.setItem("username",
                username
            );

            setMessage("Login successful!");

            navigate("/dashboard");

            console.log("JWT Access Token:", response.data.access);

            // We will add dashboard navigation here next.
        } catch (err) {
            console.error(err);

            setError(true);

            if (err.response) {
                setMessage(
                    err.response.data.detail ||
                    "Invalid username or password."
                );
            } else {
                setMessage(
                    "Unable to connect to the FacilityERP server."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Left branding section */}
            <div className="login-brand">

                <div className="brand-content">

                    <div className="brand-logo">
                        F
                    </div>

                    <h1>FacilityERP</h1>

                    <p className="brand-subtitle">
                        Facility Management Enterprise Platform
                    </p>

                    <div className="brand-divider"></div>

                    <p className="brand-description">
                        Manage employees, assets, maintenance,
                        inventory, procurement and facility
                        operations from one centralized platform.
                    </p>

                    <div className="feature-list">

                        <div className="feature-item">
                            <span>✓</span>
                            <p>Asset & Facility Management</p>
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            <p>Maintenance & Work Orders</p>
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            <p>Inventory & Procurement</p>
                        </div>

                        <div className="feature-item">
                            <span>✓</span>
                            <p>Role-Based Access Control</p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Login section */}
            <div className="login-section">

                <div className="login-card">

                    <div className="mobile-logo">
                        <div className="brand-logo">
                            F
                        </div>
                        <h1>FacilityERP</h1>
                    </div>

                    <div className="login-header">

                        <p className="welcome-text">
                            Welcome back
                        </p>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p className="login-info">
                            Enter your credentials to access
                            FacilityERP.
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    👤
                                </span>

                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    autoComplete="username"
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "◉" : "○"}
                                </button>

                            </div>

                        </div>

                        {message && (
                            <div
                                className={
                                    error
                                        ? "message error-message"
                                        : "message success-message"
                                }
                            >
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                    </form>

                    <div className="security-note">
                        <span>🔐</span>
                        <span>
                            Secured with JWT authentication
                        </span>
                    </div>

                    <p className="copyright">
                        © 2026 FacilityERP. All rights reserved.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;