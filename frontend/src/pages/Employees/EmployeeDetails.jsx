import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(`employees/${id}/`);

        if (isMounted) {
          setEmployee(response.data);
        }
      } catch (error) {
        console.error("Employee details error:", error);

        if (!isMounted) return;

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");
          navigate("/");
          return;
        }

        setErrorMessage(
          error.response?.data?.detail ||
            (error.response?.status === 404
              ? "Employee not found."
              : "Unable to load employee details."),
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEmployee();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/employees");
  };

  const handleEdit = () => {
    navigate(`/employees/${id}/edit`);
  };

  const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "object") {
      return value.department_name || value.name || value.title || "-";
    }

    return String(value);
  };

  const getDepartmentName = () => {
    if (!employee) return "-";

    return getDisplayValue(employee.department_name ?? employee.department);
  };

  const getStatusClass = () => {
    const status = String(employee?.status || "").toLowerCase();

    if (["active", "available", "completed"].includes(status)) {
      return "status-active";
    }

    if (["inactive", "disabled"].includes(status)) {
      return "status-inactive";
    }

    if (["on leave", "on_leave", "pending"].includes(status)) {
      return "status-pending";
    }

    return "status-default";
  };

  if (loading) {
    return (
      <div className="details-page">
        <style>{`
                    .details-page {
                        min-height: 100vh;
                        padding: 32px;
                        background: #f8fafc;
                        font-family: Inter, Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .loading-card {
                        padding: 30px;
                        background: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 14px;
                        color: #475569;
                    }
                `}</style>

        <div className="loading-card">Loading employee details...</div>
      </div>
    );
  }

  if (errorMessage || !employee) {
    return (
      <div className="details-page">
        <style>{`
                    .details-page {
                        min-height: 100vh;
                        padding: 32px;
                        background: #f8fafc;
                        font-family: Inter, Arial, sans-serif;
                    }

                    .error-card {
                        max-width: 650px;
                        margin: 70px auto;
                        padding: 25px;
                        background: white;
                        border: 1px solid #fecdd3;
                        border-radius: 12px;
                        color: #be123c;
                    }

                    .back-btn {
                        margin-top: 20px;
                        padding: 10px 18px;
                        border: none;
                        border-radius: 8px;
                        background: #5b4bdb;
                        color: white;
                        cursor: pointer;
                    }
                `}</style>

        <div className="error-card">
          {errorMessage || "Employee information is unavailable."}

          <br />

          <button className="back-btn" onClick={handleBack}>
            Back to Employees
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <style>{`
                * {
                    box-sizing: border-box;
                }

                .details-page {
                    min-height: 100vh;
                    padding: 32px;
                    background: linear-gradient(
                        135deg,
                        #f8f9ff 0%,
                        #f5f7fb 50%,
                        #eef1ff 100%
                    );
                    font-family: Inter, Arial, sans-serif;
                    color: #1e293b;
                }

                .details-container {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .details-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 28px;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .employee-avatar {
                    width: 58px;
                    height: 58px;
                    flex-shrink: 0;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        #5b4bdb,
                        #4334b5
                    );
                    color: white;
                    font-size: 25px;
                    font-weight: 700;
                }

                .page-title {
                    margin: 0;
                    font-size: 27px;
                    font-weight: 750;
                    color: #172033;
                }

                .page-subtitle {
                    margin: 5px 0 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .back-button,
                .edit-button {
                    padding: 11px 17px;
                    border-radius: 9px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .back-button {
                    border: 1px solid #d7deea;
                    background: white;
                    color: #475569;
                }

                .details-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 10px 35px rgba(15,23,42,0.07);
                }

                .profile-header {
                    padding: 28px 30px;
                    border-bottom: 1px solid #edf0f5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }

                .profile-name {
                    margin: 0;
                    font-size: 23px;
                    color: #172033;
                    overflow-wrap: anywhere;
                }

                .employee-code {
                    margin-top: 7px;
                    color: #64748b;
                    font-size: 13px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .status-active {
                    background: #dcfce7;
                    color: #166534;
                }

                .status-inactive {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-default {
                    background: #e2e8f0;
                    color: #334155;
                }

                .details-content {
                    padding: 30px;
                }

                .section-title {
                    margin: 0 0 20px;
                    font-size: 16px;
                    color: #1e293b;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 20px 28px;
                }

                .detail-item {
                    min-width: 0;
                    padding: 17px;
                    background: #f8fafc;
                    border: 1px solid #edf0f5;
                    border-radius: 10px;
                }

                .detail-label {
                    display: block;
                    margin-bottom: 7px;
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-value {
                    color: #334155;
                    font-size: 14px;
                    font-weight: 600;
                    overflow-wrap: anywhere;
                }

                .details-footer {
                    margin-top: 30px;
                    padding-top: 25px;
                    border-top: 1px solid #edf0f5;
                    display: flex;
                    justify-content: flex-end;
                }

                .edit-button {
                    border: none;
                    background: linear-gradient(
                        135deg,
                        #5b4bdb,
                        #4938c4
                    );
                    color: white;
                    box-shadow: 0 6px 16px rgba(91,75,219,0.20);
                }

                .back-button:hover {
                    background: #f8fafc;
                }

                .edit-button:hover {
                    transform: translateY(-1px);
                }

                @media (max-width: 700px) {
                    .details-page {
                        padding: 18px;
                    }

                    .details-header {
                        align-items: flex-start;
                    }

                    .header-left {
                        gap: 10px;
                    }

                    .employee-avatar {
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                    }

                    .page-title {
                        font-size: 22px;
                    }

                    .back-button {
                        display: none;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .profile-header {
                        align-items: flex-start;
                        padding: 22px;
                    }

                    .details-content {
                        padding: 22px;
                    }
                }
            `}</style>

      <div className="details-page">
        <div className="details-container">
          <div className="details-header">
            <div className="header-left">
              <div className="employee-avatar">
                {employee.employee_name?.charAt(0)?.toUpperCase() || "E"}
              </div>

              <div>
                <h1 className="page-title">Employee Details</h1>

                <p className="page-subtitle">
                  View complete employee information
                </p>
              </div>
            </div>

            <button className="back-button" onClick={handleBack}>
              Back to Employees
            </button>
          </div>

          <div className="details-card">
            <div className="profile-header">
              <div>
                <h2 className="profile-name">
                  {getDisplayValue(employee.employee_name)}
                </h2>

                <div className="employee-code">
                  Employee Code: {getDisplayValue(employee.employee_code)}
                </div>
              </div>

              <span className={`status-badge ${getStatusClass()}`}>
                {getDisplayValue(employee.status)}
              </span>
            </div>

            <div className="details-content">
              <h3 className="section-title">Employee Information</h3>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Employee Code</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.employee_code)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.employee_name)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.email)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.phone)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Designation</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.designation)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{getDepartmentName()}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Joining Date</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.joining_date)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Employment Status</span>
                  <span className="detail-value">
                    {getDisplayValue(employee.status)}
                  </span>
                </div>
              </div>

              <div className="details-footer">
                <button className="edit-button" onClick={handleEdit}>
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDetails;
