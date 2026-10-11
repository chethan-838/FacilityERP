import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Maintenance.css";

function MaintenanceList() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await api.get("maintenance-requests/");
        const data = response.data;

        setRequests(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : [],
        );
      } catch (err) {
        setError(
          "Unable to load maintenance requests. Check the API endpoint.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  const pendingCount = requests.filter(
    (request) => String(request.status ?? "").toLowerCase() === "pending",
  ).length;

  const completedCount = requests.filter(
    (request) => String(request.status ?? "").toLowerCase() === "completed",
  ).length;

  return (
    <div className="maintenance-page">
      <header className="maintenance-header">
        <div>
          <p className="maintenance-eyebrow">FACILITY MANAGEMENT</p>

          <h1>Maintenance Management</h1>

          <p>Monitor and manage facility maintenance requests.</p>
        </div>

        <button
          className="maintenance-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="maintenance-summary">
        <div className="maintenance-summary-card">
          <span>Total Requests</span>
          <strong>{loading || error ? "—" : requests.length}</strong>
        </div>

        <div className="maintenance-summary-card">
          <span>Pending Requests</span>
          <strong>{loading || error ? "—" : pendingCount}</strong>
        </div>

        <div className="maintenance-summary-card">
          <span>Completed Requests</span>
          <strong>{loading || error ? "—" : completedCount}</strong>
        </div>
      </section>

      <section className="maintenance-table-card">
        <h2>Maintenance Requests</h2>

        {loading ? (
          <p className="maintenance-empty">Loading maintenance requests...</p>
        ) : error ? (
          <p className="maintenance-error">{error}</p>
        ) : requests.length === 0 ? (
          <p className="maintenance-empty">No maintenance requests found.</p>
        ) : (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request, index) => (
                  <tr key={request.id ?? index}>
                    <td>{request.id ?? "—"}</td>

                    <td>{request.description ?? "—"}</td>

                    <td>{request.priority ?? "—"}</td>

                    <td>
                      <span className="maintenance-status">
                        {request.status ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default MaintenanceList;
