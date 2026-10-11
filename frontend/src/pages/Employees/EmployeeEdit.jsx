import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function EmployeeEdit() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(`employees/${id}/`);

      const employee = response.data;

      setFormData({
        employee_code: employee.employee_code || "",
        employee_name: employee.employee_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        designation: employee.designation || "",
        joining_date: employee.joining_date || "",
        status: employee.status || "Active",
        department:
          employee.department != null
            ? String(
                typeof employee.department === "object"
                  ? employee.department.id
                  : employee.department,
              )
            : "",
      });
    } catch (error) {
      console.error("Employee loading error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        navigate("/");
        return;
      }

      setErrorMessage(
        error.response?.data?.detail || "Unable to load employee information.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");

      await api.put(`employees/${id}/`, formData);

      navigate(`/employees/${id}`, {
        state: {
          successMessage: "Employee updated successfully!",
        },
      });
    } catch (error) {
      console.error("Employee update error:", error.response?.data);

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
        setErrorMessage(apiError || "Unable to update employee.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="edit-loading-page">
        <style>{`
                    .edit-loading-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f8fafc;
                        font-family: Inter, Arial, sans-serif;
                    }

                    .loading-card {
                        background: white;
                        padding: 35px 50px;
                        border-radius: 14px;
                        box-shadow:
                            0 8px 25px rgba(15,23,42,0.08);
                        color: #475569;
                        font-size: 15px;
                    }
                `}</style>

        <div className="loading-card">Loading employee information...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
                * {
                    box-sizing: border-box;
                }

                .edit-page {
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

                .edit-container {
                    max-width: 1150px;
                    margin: 0 auto;
                }

                .edit-header {
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

                .edit-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        linear-gradient(
                            135deg,
                            #5b4bdb,
                            #4334b5
                        );
                    color: white;
                    font-size: 23px;
                    box-shadow:
                        0 8px 20px rgba(
                            91,
                            75,
                            219,
                            0.25
                        );
                }

                .page-title {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 750;
                    color: #172033;
                }

                .page-subtitle {
                    margin: 5px 0 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .back-button {
                    padding: 10px 17px;
                    border: 1px solid #d7deea;
                    border-radius: 9px;
                    background: white;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .back-button:hover {
                    background: #f8fafc;
                }

                .edit-card {
                    background:
                        rgba(255,255,255,0.95);
                    border:
                        1px solid #e2e8f0;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow:
                        0 10px 35px rgba(
                            15,
                            23,
                            42,
                            0.07
                        );
                }

                .card-top {
                    padding: 25px 30px;
                    border-bottom:
                        1px solid #edf0f5;
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

                .form-content {
                    padding: 30px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns:
                        1fr 1fr;
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

                .required-star {
                    color: #e11d48;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform:
                        translateY(-50%);
                    color: #94a3b8;
                    font-size: 15px;
                    pointer-events: none;
                }
                
                .form-input,
                .form-select {
                    width: 100%;
                    height: 46px;
                    padding:
                        0 14px 0 42px;
                    border:
                        1px solid #d7deea;
                    border-radius: 9px;
                    background: white;
                    color: #1e293b;
                    font-size: 14px;
                    outline: none;
                    transition:
                        all 0.2s ease;
                }

                .form-input:hover,
                .form-select:hover {
                    border-color: #b8c1d2;
                }

                .form-input:focus,
                .form-select:focus {
                    border-color: #5b4bdb;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            91,
                            75,
                            219,
                            0.10
                        );
                }

                .status-wrapper {
                    position: relative;
                }

                .status-dot {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform:
                        translateY(-50%);
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

                .helper-text {
                    margin-top: 7px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .error-message {
                    margin: 0 30px 20px;
                    padding: 14px 17px;
                    border-radius: 9px;
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    color: #be123c;
                    font-size: 13px;
                }

                .form-divider {
                    height: 1px;
                    background: #edf0f5;
                    margin: 30px 0 25px;
                }

                .form-footer {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
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
                    background: white;
                    color: #475569;
                    border:
                        1px solid #d7deea;
                }

                .cancel-button:hover {
                    background: #f8fafc;
                }

                .save-button {
                    background:
                        linear-gradient(
                            135deg,
                            #5b4bdb,
                            #4938c4
                        );
                    color: white;
                    border: none;
                    box-shadow:
                        0 6px 16px
                        rgba(
                            91,
                            75,
                            219,
                            0.22
                        );
                }

                .save-button:hover {
                    transform:
                        translateY(-1px);
                }

                .save-button:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                    transform: none;
                }

                @media (max-width: 800px) {
                    .edit-page {
                        padding: 20px;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .back-button {
                        display: none;
                    }
                }

                @media (max-width: 500px) {
                    .edit-page {
                        padding: 14px;
                    }

                    .page-title {
                        font-size: 23px;
                    }

                    .form-content {
                        padding: 20px;
                    }

                    .card-top {
                        padding: 20px;
                    }

                    .button-group {
                        width: 100%;
                    }

                    .cancel-button,
                    .save-button {
                        flex: 1;
                    }
                }
            `}</style>

      <div className="edit-page">
        <div className="edit-container">
          <div className="edit-header">
            <div className="header-left">
              <div className="edit-icon">✎</div>

              <div>
                <h1 className="page-title">Edit Employee</h1>

                <p className="page-subtitle">
                  Update employee information in FacilityERP
                </p>
              </div>
            </div>

            <button
              type="button"
              className="back-button"
              onClick={handleCancel}
            >
              ← Back to Details
            </button>
          </div>

          <div className="edit-card">
            <div className="card-top">
              <h2 className="section-title">Employee Information</h2>

              <p className="section-description">
                Update the employee's information and employment details.
              </p>
            </div>

            {errorMessage && (
              <div className="error-message">⚠ {errorMessage}</div>
            )}

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
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>

                    <div className="input-wrapper">
                      <span className="input-icon">☎</span>

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Designation</label>

                    <div className="input-wrapper">
                      <span className="input-icon">💼</span>

                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="form-input"
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
                      disabled={saving}
                    >
                      {saving ? "Updating..." : "✓ Update Employee"}
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

export default EmployeeEdit;
