import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function EmployeeForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_code: "",
    employee_name: "",
    email: "",
    phone: "",
    designation: "",
    joining_date: "",
    status: "Active",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      await api.post("employees/", formData);

      navigate("/employees", {
        state: {
          successMessage: "Employee added successfully!",
        },
      });
    } catch (error) {
      console.error("Full API error:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        navigate("/");
        return;
      }

      const apiError = error.response?.data;

      if (typeof apiError === "object" && apiError !== null) {
        setErrorMessage(JSON.stringify(apiError));
      } else {
        setErrorMessage(apiError || "Unable to add employee.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <>
      <style>{`
            * {
                    box-sizing: border-box;
                }

                .employee-page {
                    min-height: 100vh;
                    padding: 32px;
                    background:
                        linear-gradient(
                            135deg,
                            #f8f9ff 0%,
                            #f5f7fb 50%,
                            #eef1ff 100%
                        );
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    color: #1e293b;
                }

                .employee-container {
                    max-width: 1150px;
                    margin: 0 auto;
                }

                .employee-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 28px;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .employee-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        #5b4bdb,
                        #4334b5
                    );
                    color: white;
                    font-size: 24px;
                    box-shadow:
                        0 8px 20px rgba(91, 75, 219, 0.25);
                }

                .page-title {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 750;
                    letter-spacing: -0.5px;
                    color: #172033;
                }

                .page-subtitle {
                    margin: 5px 0 0;
                    font-size: 14px;
                    color: #64748b;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 10px 16px;
                    border: 1px solid #dbe1ed;
                    border-radius: 9px;
                    background: rgba(255,255,255,0.8);
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .back-button:hover {
                    background: white;
                    border-color: #bfc7d8;
                    transform: translateY(-1px);
                }

                .employee-card {
                    background: rgba(255,255,255,0.94);
                    border: 1px solid rgba(226,232,240,0.9);
                    border-radius: 18px;
                    box-shadow:
                        0 10px 35px rgba(15,23,42,0.07);
                    overflow: hidden;
                }
                
                .card-top {
                    padding: 25px 30px;
                    border-bottom: 1px solid #edf0f5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .section-title {
                    margin: 0;
                    font-size: 17px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .section-description {
                    margin: 5px 0 0;
                    color: #64748b;
                    font-size: 13px;
                }

                .required-text {
                    color: #94a3b8;
                    font-size: 12px;
                }

                .required-star {
                    color: #e11d48;
                }

                .form-content {
                    padding: 30px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px 28px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    margin-bottom: 8px;
                    color: #334155;
                    font-size: 13px;
                    font-weight: 650;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    font-size: 15px;
                    pointer-events: none;
                }

                .form-input,
                .form-select {
                    width: 100%;
                    height: 46px;
                    padding: 0 14px 0 42px;
                    border: 1px solid #d7deea;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #1e293b;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .form-input::placeholder {
                    color: #a1aabd;
                }

                .form-input:hover,
                .form-select:hover {
                    border-color: #b8c1d2;
                }

                .form-input:focus,
                .form-select:focus {
                    border-color: #5b4bdb;
                    box-shadow:
                        0 0 0 3px rgba(91,75,219,0.10);
                }

                .form-select {
                    cursor: pointer;
                    appearance: auto;
                }

                .helper-text {
                    margin-top: 7px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .status-wrapper {
                    position: relative;
                }

                .status-dot {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    z-index: 1;
                    pointer-events: none;
                }

                .status-select {
                    padding-left: 35px;
                }

                .form-divider {
                    height: 1px;
                    background: #edf0f5;
                    margin: 30px 0 25px;
                }

                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-note {
                    color: #94a3b8;
                    font-size: 12px;
                }

                .button-group {
                    display: flex;
                    gap: 12px;
                }

                .cancel-button,
                .save-button {
                    height: 44px;
                    padding: 0 22px;
                    border-radius: 9px;
                    font-size: 13px;
                    font-weight: 650;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .cancel-button {
                    background: #ffffff;
                    color: #475569;
                    border: 1px solid #d7deea;
                }

                .form-input:hover,
                .form-select:hover {
                    border-color: #b8c1d2;
                }

                .form-input:focus,
                .form-select:focus {
                    border-color: #5b4bdb;
                    box-shadow:
                        0 0 0 3px rgba(91,75,219,0.10);
                }

                .form-select {
                    cursor: pointer;
                    appearance: auto;
                }

                .helper-text {
                    margin-top: 7px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .status-wrapper {
                    position: relative;
                }

                .status-dot {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    z-index: 1;
                    pointer-events: none;
                }

                .status-select {
                    padding-left: 35px;
                }

                .form-divider {
                    height: 1px;
                    background: #edf0f5;
                    margin: 30px 0 25px;
                }

                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-note {
                    color: #94a3b8;
                    font-size: 12px;
                }

                .button-group {
                    display: flex;
                    gap: 12px;
                }

                .cancel-button,
                .save-button {
                    height: 44px;
                    padding: 0 22px;
                    border-radius: 9px;
                    font-size: 13px;
                    font-weight: 650;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .cancel-button {
                    background: #ffffff;
                    color: #475569;
                    border: 1px solid #d7deea;
                }

                .cancel-button:hover {
                    background: #f8fafc;
                    border-color: #b8c1d2;
                }

                .save-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(
                        135deg,
                        #5b4bdb,
                        #4938c4
                    );
                    color: white;
                    border: none;
                    box-shadow:
                        0 6px 16px rgba(91,75,219,0.22);
                }

                .save-button:hover {
                    transform: translateY(-1px);
                    box-shadow:
                        0 8px 20px rgba(91,75,219,0.28);
                }

                .save-button:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                    transform: none;
                }

                .error-message {
                    max-width: 1150px;
                    margin: 0 auto 20px;
                    padding: 14px 17px;
                    border-radius: 9px;
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    color: #be123c;
                    font-size: 13px;
                    font-weight: 500;
                }

                @media (max-width: 800px) {

                    .employee-page {
                        padding: 20px;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .card-top {
                        padding: 22px;
                    }

                    .form-content {
                        padding: 22px;
                    }

                    .employee-header {
                        align-items: flex-start;
                    }

                    .back-button {
                        display: none;
                    }

                    .form-footer {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 18px;
                    }

                    .button-group {
                        width: 100%;
                    }

                    .cancel-button,
                    .save-button {
                        flex: 1;
                    }
                }

                @media (max-width: 500px) {

                    .employee-page {
                        padding: 14px;
                    }

                    .page-title {
                        font-size: 23px;
                    }

                    .employee-icon {
                        width: 44px;
                        height: 44px;
                        font-size: 20px;
                    }

                    .card-top {
                        padding: 18px;
                    }

                    .form-content {
                        padding: 18px;
                    }

                    .button-group {
                        flex-direction: column;
                    }

                    .cancel-button,
                    .save-button {
                        width: 100%;
                    }
                }

            `}</style>

      <div className="employee-page">
        <div className="employee-container">
          <div className="employee-header">
            <div className="header-left">
              <div className="employee-icon">👤</div>

              <div>
                <h1 className="page-title">Add Employee</h1>

                <p className="page-subtitle">
                  Create a new employee profile in FacilityERP
                </p>
              </div>
            </div>

            <button
              type="button"
              className="back-button"
              onClick={handleCancel}
            >
              ← Back to Employees
            </button>
          </div>

          {errorMessage && (
            <div className="error-message">⚠ {errorMessage}</div>
          )}

          <div className="employee-card">
            <div className="card-top">
              <div>
                <h2 className="section-title">Employee Information</h2>

                <p className="section-description">
                  Enter the employee's basic information and employment details.
                </p>
              </div>

              <div className="required-text">
                <span className="required-star">*</span> Required fields
              </div>
            </div>

            <div className="form-content">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Employee Code <span className="required-star">*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="input-icon">#</span>

                      <input
                        type="text"
                        name="employee_code"
                        value={formData.employee_code}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="e.g. EMP005"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Employee Name <span className="required-star">*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>

                      <input
                        type="text"
                        name="employee_name"
                        value={formData.employee_name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>

                    <div className="input-wrapper">
                      <span className="input-icon">✉</span>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="employee@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>

                    <div className="input-wrapper">
                      <span className="input-icon">☎</span>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter 10-digit phone number"
                        pattern="[0-9]{10}"
                        title="Enter exactly 10 digits, or leave this field blank."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Designation <span className="required-star">*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="input-icon">💼</span>

                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Facility Manager"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Joining Date</label>

                    <div className="input-wrapper">
                      <span className="input-icon">📅</span>

                      <input
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleChange}
                        className="form-input"
                        max={new Date().toLocaleDateString("en-CA")}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employment Status</label>

                    <div className="status-wrapper">
                      <span className="status-dot"></span>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select status-select"
                      >
                        <option value="Active">Active</option>

                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>

                    <div className="input-wrapper">
                      <span className="input-icon">🏢</span>

                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select Department</option>

                        <option value="2">Development</option>

                        <option value="3">HR</option>

                        <option value="4">Finance</option>
                      </select>
                    </div>

                    <div className="helper-text">
                      Select the employee's department.
                    </div>
                  </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-footer">
                  <div className="footer-note">
                    Employee information can be updated later.
                  </div>

                  <div className="button-group">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-button"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "✓ Save Employee"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeForm;
