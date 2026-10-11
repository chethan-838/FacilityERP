import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./AssetList.css";

function AssetList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get("assets/");
        const data = response.data;

        setAssets(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : [],
        );
      } catch (err) {
        console.error("Asset API error:", err);
        setError("Unable to load assets. Please check the backend API.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="asset-page">
      <header className="asset-header">
        <div>
          <p className="asset-eyebrow">FACILITY MANAGEMENT</p>
          <h1>Assets</h1>
          <p>View and manage facility assets.</p>
        </div>

        {/* Header Buttons */}
        <div className="asset-header-actions">
          <button
            type="button"
            className="asset-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <button
            type="button"
            className="asset-add-btn"
            onClick={() => navigate("/assets/add")}
          >
            + Add Asset
          </button>
        </div>
      </header>

      <section className="asset-summary">
        <div className="asset-summary-card">
          <span>Total Assets</span>
          <strong>{loading ? "..." : assets.length}</strong>
        </div>
      </section>

      <section className="asset-table-card">
        <h2>Asset Register</h2>

        {loading ? (
          <p>Loading assets...</p>
        ) : error ? (
          <p className="asset-error">{error}</p>
        ) : assets.length === 0 ? (
          <p>No assets found.</p>
        ) : (
          <div className="asset-table-wrapper">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset, index) => (
                  <tr key={asset.id ?? index}>
                    <td>
                      {asset.asset_name ??
                        asset.name ??
                        asset.asset_code ??
                        `Asset ${index + 1}`}
                    </td>
                    <td>{asset.category_name ?? asset.category ?? "—"}</td>
                    <td>{asset.location_name ?? asset.location ?? "—"}</td>
                    <td>
                      <span
                        className={`asset-status ${
                          String(asset.status ?? "").toLowerCase() === "active"
                            ? "asset-status-active"
                            : String(asset.status ?? "").toLowerCase() ===
                                "inactive"
                              ? "asset-status-inactive"
                              : String(asset.status ?? "")
                                    .toLowerCase()
                                    .replace(/_/g, " ") === "under maintenance"
                                ? "asset-status-maintenance"
                                : "asset-status-default"
                        }`}
                      >
                        {asset.status ?? "—"}
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

export default AssetList;
