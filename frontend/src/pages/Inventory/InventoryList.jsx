import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Inventory.css";

function InventoryList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("inventory/");
        const data = response.data;

        setItems(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : [],
        );
      } catch (err) {
        setError("Unable to load inventory. Please check the API endpoint.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const lowStockCount = items.filter((item) => {
    const quantity = Number(
      item.quantity ?? item.current_stock ?? item.current_quantity,
    );
    const minimum = Number(
      item.minimum_stock ?? item.min_stock ?? item.minimum_quantity,
    );

    return (
      Number.isFinite(quantity) &&
      Number.isFinite(minimum) &&
      quantity <= minimum
    );
  }).length;

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div>
          <p className="inventory-eyebrow">FACILITY MANAGEMENT</p>
          <h1>Inventory Management</h1>
          <p>Monitor spare parts, stock levels, and storage.</p>
        </div>

        <button
          className="inventory-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="inventory-summary">
        <div className="inventory-summary-card">
          <span>Total Items</span>
          <strong>{loading || error ? "—" : items.length}</strong>
        </div>

        <div className="inventory-summary-card">
          <span>Low Stock Items</span>
          <strong>{loading || error ? "—" : lowStockCount}</strong>
        </div>
      </section>

      <section className="inventory-table-card">
        <h2>Inventory Register</h2>

        {loading ? (
          <p className="inventory-empty">Loading inventory...</p>
        ) : error ? (
          <p className="inventory-error">{error}</p>
        ) : items.length === 0 ? (
          <p className="inventory-empty">No inventory items found.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Current Stock</th>
                  <th>Minimum Stock</th>
                  <th>Storage Location</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td>
                      {item.spare_part_name ??
                        item.item_name ??
                        item.name ??
                        `Item ${index + 1}`}
                    </td>
                    <td>
                      {item.quantity ??
                        item.current_stock ??
                        item.current_quantity ??
                        "—"}
                    </td>
                    <td>
                      {item.minimum_stock ??
                        item.min_stock ??
                        item.minimum_quantity ??
                        "—"}
                    </td>
                    <td>{item.storage_location ?? "—"}</td>
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

export default InventoryList;
