import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Notifications.css";

function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("notifications/");
        const data = response.data;

        setNotifications(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : [],
        );
      } catch (err) {
        setError(
          "Unable to load notifications. Please check the API endpoint.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <p className="notifications-eyebrow">FACILITY MANAGEMENT</p>
          <h1>Notifications</h1>
          <p>View facility updates and important alerts.</p>
        </div>

        <button
          className="notifications-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="notifications-summary">
        <div className="notifications-summary-card">
          <span>Total Notifications</span>
          <strong>{loading || error ? "—" : notifications.length}</strong>
        </div>
      </section>

      <section className="notifications-list-card">
        <h2>Recent Notifications</h2>

        {loading ? (
          <p className="notifications-empty">Loading notifications...</p>
        ) : error ? (
          <p className="notifications-error">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="notifications-empty">No notifications found.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <article
                className="notification-item"
                key={notification.id ?? index}
              >
                <div className="notification-icon">🔔</div>

                <div className="notification-content">
                  <h3>
                    {notification.title ??
                      notification.subject ??
                      `Notification ${index + 1}`}
                  </h3>

                  <p>
                    {notification.message ??
                      notification.description ??
                      "No additional details available."}
                  </p>

                  <span className="notification-date">
                    {notification.created_at
                      ? new Date(notification.created_at).toLocaleString()
                      : "Date unavailable"}
                  </span>
                </div>

                <span className="notification-status">
                  {notification.is_read === true ? "Read" : "Unread"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default NotificationsPage;
