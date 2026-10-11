import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Reports.css";

function ReportsPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const results = await Promise.all([
          api.get("employees/"),
          api.get("assets/"),
          api.get("maintenance-requests/"),
          api.get("inventory/"),
        ]);

        const getRows = (response) => {
          const data = response.data;

          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.results)) return data.results;

          return [];
        };

        setEmployees(getRows(results[0]));
        setAssets(getRows(results[1]));
        setMaintenance(getRows(results[2]));
        setInventory(getRows(results[3]));
      } catch (err) {
        setError(
          "Unable to load all report data. Check your backend API endpoints.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const reportItems = [
    {
      title: "Employee Report",
      description: "Review employee records.",
      count: employees.length,
      icon: "👥",
    },
    {
      title: "Asset Report",
      description: "Review registered facility assets.",
      count: assets.length,
      icon: "🏢",
    },
    {
      title: "Maintenance Report",
      description: "Review maintenance requests.",
      count: maintenance.length,
      icon: "🔧",
    },
    {
      title: "Inventory Report",
      description: "Review inventory records.",
      count: inventory.length,
      icon: "📦",
    },
  ];

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <p className="reports-eyebrow">FACILITY MANAGEMENT</p>
          <h1>Reports & Analytics</h1>
          <p>Review key operational information in one place.</p>
        </div>

        <button
          className="reports-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      {error && <p className="reports-error">{error}</p>}

      <section className="reports-summary">
        <div className="reports-summary-card">
          <span>Total Employees</span>
          <strong>{loading ? "—" : employees.length}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Total Assets</span>
          <strong>{loading ? "—" : assets.length}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Maintenance Requests</span>
          <strong>{loading ? "—" : maintenance.length}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Inventory Records</span>
          <strong>{loading ? "—" : inventory.length}</strong>
        </div>
      </section>

      <section className="reports-list-card">
        <h2>Available Reports</h2>

        <div className="reports-grid">
          {reportItems.map((report) => (
            <article className="report-card" key={report.title}>
              <div className="report-icon">{report.icon}</div>

              <div>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <span className="report-count">
                  {loading ? "Loading..." : `${report.count} records`}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;
