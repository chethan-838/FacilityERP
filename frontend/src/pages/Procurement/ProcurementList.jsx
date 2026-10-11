import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Procurement.css";

function ProcurementList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("purchase-orders/");
        const data = response.data;

        setOrders(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : [],
        );
      } catch (err) {
        setError(
          "Unable to load purchase orders. Please check the API endpoint.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const pendingCount = orders.filter((order) =>
    ["draft", "pending", "submitted", "approved"].includes(
      String(order.status ?? "").toLowerCase(),
    ),
  ).length;

  const receivedCount = orders.filter(
    (order) => String(order.status ?? "").toLowerCase() === "received",
  ).length;

  return (
    <div className="procurement-page">
      <header className="procurement-header">
        <div>
          <p className="procurement-eyebrow">FACILITY MANAGEMENT</p>
          <h1>Procurement Management</h1>
          <p>Track purchase orders and supplier deliveries.</p>
        </div>

        <button
          className="procurement-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="procurement-summary">
        <div className="procurement-summary-card">
          <span>Total Purchase Orders</span>
          <strong>{loading || error ? "—" : orders.length}</strong>
        </div>

        <div className="procurement-summary-card">
          <span>Pending Orders</span>
          <strong>{loading || error ? "—" : pendingCount}</strong>
        </div>

        <div className="procurement-summary-card">
          <span>Received Orders</span>
          <strong>{loading || error ? "—" : receivedCount}</strong>
        </div>
      </section>

      <section className="procurement-table-card">
        <h2>Purchase Orders</h2>

        {loading ? (
          <p className="procurement-empty">Loading purchase orders...</p>
        ) : error ? (
          <p className="procurement-error">{error}</p>
        ) : orders.length === 0 ? (
          <p className="procurement-empty">No purchase orders found.</p>
        ) : (
          <div className="procurement-table-wrapper">
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Vendor</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id ?? index}>
                    <td>{order.id ?? "—"}</td>
                    <td>{order.vendor_name ?? order.vendor ?? "—"}</td>
                    <td>{order.order_date ?? "—"}</td>
                    <td>
                      <span className="procurement-status">
                        {order.status ?? "Unknown"}
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

export default ProcurementList;
