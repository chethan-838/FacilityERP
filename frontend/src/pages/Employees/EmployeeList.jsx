import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || "",
  );
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchEmployees = async (url = "employees/") => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(url);

      if (Array.isArray(response.data)) {
        setEmployees(response.data);
        setNextPage(null);
        setPreviousPage(null);
      } else {
        setEmployees(response.data.results || []);
        setNextPage(response.data.next || null);
        setPreviousPage(response.data.previous || null);
      }
    } catch (error) {
      console.error("Employee API error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        navigate("/");
        return;
      }

      setErrorMessage("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId, employeeName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employeeName}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`employees/${employeeId}/`);
      setSuccessMessage("Employee deleted successfully!");
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);

      if (error.response?.status === 403) {
        alert("You do not have permission to delete this employee.");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        navigate("/");
      } else {
        alert("Failed to delete employee.");
      }
    }
  };

  const handleAddEmployee = () => {
    navigate("/employees/add");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      employee.employee_name?.toLowerCase().includes(search) ||
      employee.employee_code?.toLowerCase().includes(search) ||
      employee.email?.toLowerCase().includes(search) ||
      employee.designation?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || employee.status === statusFilter;

    const employeeDepartment =
      typeof employee.department === "object"
        ? employee.department?.id
        : employee.department;

    const matchesDepartment =
      departmentFilter === "All" ||
      String(employeeDepartment) === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filtersAreActive =
    searchTerm.trim() !== "" ||
    statusFilter !== "All" ||
    departmentFilter !== "All";

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#1e293b",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Employee Management
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Manage facility employees and staff
          </p>
        </div>

        {/* Header Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Back to Dashboard Button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#5b4bdb",
              color: "white",
              border: "1px solid #4334b5",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Back to Dashboard
          </button>

          {/* Add Employee Button */}
          <button
            type="button"
            onClick={handleAddEmployee}
            style={{
              backgroundColor: "#5b4bdb",
              color: "#ffffff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #86efac",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          <span>✓ {successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
            style={{
              border: "none",
              background: "transparent",
              color: "#166534",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Employee Management Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "22px",
          boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* Employee Counts */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#1e293b", fontSize: "19px" }}>
              Employee List
            </h2>
            <p
              style={{ margin: "6px 0 0", color: "#64748b", fontSize: "13px" }}
            >
              Search, filter, and manage employee records
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <div style={countCardStyle}>
              <span style={countLabelStyle}>Employees on page</span>
              <strong style={countNumberStyle}>{employees.length}</strong>
            </div>

            <div style={countCardStyle}>
              <span style={countLabelStyle}>Filtered results</span>
              <strong style={countNumberStyle}>
                {filteredEmployees.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <input
            type="text"
            placeholder="Search name, code, email or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search employees"
            style={{
              flex: "1 1 260px",
              minWidth: "0",
              padding: "12px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            style={filterSelectStyle}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            aria-label="Filter by department"
            style={filterSelectStyle}
          >
            <option value="All">All Departments</option>
            <option value="2">Development</option>
            <option value="3">HR</option>
            <option value="4">Finance</option>
          </select>

          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!filtersAreActive}
            style={{
              padding: "12px 16px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              backgroundColor: filtersAreActive ? "#ffffff" : "#f1f5f9",
              color: filtersAreActive ? "#475569" : "#94a3b8",
              cursor: filtersAreActive ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              padding: "35px 15px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Loading employees...
          </div>
        )}

        {/* Employee Table */}
        {!loading && !errorMessage && (
          <>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "850px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9" }}>
                    <th style={headerStyle}>Employee Code</th>
                    <th style={headerStyle}>Name</th>
                    <th style={headerStyle}>Email</th>
                    <th style={headerStyle}>Phone</th>
                    <th style={headerStyle}>Designation</th>
                    <th style={headerStyle}>Status</th>
                    <th style={headerStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: "#64748b",
                        }}
                      >
                        {employees.length === 0
                          ? "No employees have been added yet."
                          : "No employees match your search or filters."}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td style={cellStyle}>{employee.employee_code}</td>
                        <td style={cellStyle}>{employee.employee_name}</td>
                        <td style={cellStyle}>{employee.email || "-"}</td>
                        <td style={cellStyle}>{employee.phone || "-"}</td>
                        <td style={cellStyle}>{employee.designation || "-"}</td>
                        <td style={cellStyle}>
                          <span
                            style={{
                              backgroundColor:
                                employee.status === "Active"
                                  ? "#dcfce7"
                                  : "#fee2e2",
                              color:
                                employee.status === "Active"
                                  ? "#166534"
                                  : "#991b1b",
                              padding: "5px 10px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td style={cellStyle}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/employees/${employee.id}`)
                              }
                              style={viewButtonStyle}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  employee.id,
                                  employee.employee_name,
                                )
                              }
                              style={deleteButtonStyle}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => previousPage && fetchEmployees(previousPage)}
                disabled={!previousPage || loading}
                style={{
                  ...paginationButtonStyle,
                  backgroundColor: previousPage ? "#ffffff" : "#f1f5f9",
                  color: previousPage ? "#334155" : "#94a3b8",
                  cursor: previousPage ? "pointer" : "not-allowed",
                }}
              >
                ← Previous
              </button>

              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                Showing {filteredEmployees.length} of {employees.length}{" "}
                employees on this page
              </span>

              <button
                type="button"
                onClick={() => nextPage && fetchEmployees(nextPage)}
                disabled={!nextPage || loading}
                style={{
                  ...paginationButtonStyle,
                  backgroundColor: nextPage ? "#5b4bdb" : "#f1f5f9",
                  color: nextPage ? "#ffffff" : "#94a3b8",
                  cursor: nextPage ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const headerStyle = {
  padding: "15px 12px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "700",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "15px 12px",
  color: "#475569",
  fontSize: "14px",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "center",
  verticalAlign: "middle",
};

const countCardStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "10px 14px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  minWidth: "120px",
};

const countLabelStyle = {
  color: "#64748b",
  fontSize: "12px",
};

const countNumberStyle = {
  color: "#1e293b",
  fontSize: "21px",
};

const filterSelectStyle = {
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#334155",
  fontSize: "14px",
  cursor: "pointer",
  minWidth: "155px",
  boxSizing: "border-box",
};

const viewButtonStyle = {
  padding: "7px 12px",
  border: "1px solid #c7c2f3",
  borderRadius: "7px",
  backgroundColor: "#f5f3ff",
  color: "#5b4bdb",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const deleteButtonStyle = {
  padding: "7px 12px",
  border: "1px solid #fecaca",
  borderRadius: "7px",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const paginationButtonStyle = {
  padding: "10px 18px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontWeight: "600",
};

export default EmployeeList;
