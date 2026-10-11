import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import api from "./api";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [employeeCount, setEmployeeCount] = useState(null);
  const [locationCount, setLocationCount] = useState(null);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/");
      return;
    }

    setUsername(localStorage.getItem("username") || "User");

    loadEmployees();
    loadLocations();
  }, [navigate]);

  const getTotalCount = (data) => {
    if (typeof data?.count === "number") {
      return data.count;
    }

    if (Array.isArray(data)) {
      return data.length;
    }

    if (Array.isArray(data?.results)) {
      return data.results.length;
    }

    return null;
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get("employees/");
      setEmployeeCount(getTotalCount(response.data));
    } catch (error) {
      console.error("Employees API error:", error);
      setEmployeeCount(null);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get("locations/");
      setLocationCount(getTotalCount(response.data));
    } catch (error) {
      console.error("Locations API error:", error);
      setLocationCount(null);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const modules = [
    {
      title: "Employees",
      description: "Manage employee profiles and staff information.",
      icon: "users",
      color: "purple",
      action: "View Employees",
      path: "/employees",
    },
    {
      title: "Locations",
      description: "Manage buildings and facility locations.",
      icon: "building",
      color: "blue",
      action: "Manage Locations",
      path: "/locations",
    },
    {
      title: "Assets",
      description: "Track facility assets and their information.",
      icon: "monitor",
      color: "cyan",
      action: "Manage Assets",
      path: "/assets",
    },
    {
      title: "Maintenance",
      description: "Review maintenance requests and work orders.",
      icon: "wrench",
      color: "orange",
      action: "Manage Maintenance",
      path: "/maintenance",
    },
    {
      title: "Inventory",
      description: "Monitor spare parts and stock information.",
      icon: "package",
      color: "green",
      action: "Manage Inventory",
      path: "/inventory",
    },
    {
      title: "Procurement",
      description: "Manage purchasing and purchase orders.",
      icon: "shopping-cart",
      color: "pink",
      action: "Manage Procurement",
      path: "/procurement",
    },
    {
      title: "Reports",
      description: "Review facility reports and operational data.",
      icon: "chart",
      color: "blue",
      action: "View Reports",
      path: "/reports",
    },
    {
      title: "Notifications",
      description: "Review system alerts and important updates.",
      icon: "bell",
      color: "orange",
      action: "View Notifications",
      path: "/notifications",
    },
  ];

  const renderCount = (loading, count) => {
    if (loading) return "...";
    if (count === null) return "—";
    return count.toLocaleString("en-IN");
  };
  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <button
          className="sidebar-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="brand-mark">F</span>
          <span>
            <strong>FacilityERP</strong>
            <small>Facility Management</small>
          </span>
        </button>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-symbol">▦</span>
            Dashboard
          </button>

          <button className="nav-item" onClick={() => navigate("/employees")}>
            <span className="nav-symbol">♙</span>
            Employees
          </button>

          {modules
            .filter((item) => item.title !== "Employees")
            .map((item) => (
              <button
                key={item.title}
                className="nav-item"
                onClick={() => navigate(item.path)}
              >
                <span className="nav-symbol">
                  {item.title === "Locations" && "⌂"}
                  {item.title === "Assets" && "▣"}
                  {item.title === "Maintenance" && "⚙"}
                  {item.title === "Inventory" && "▤"}
                  {item.title === "Procurement" && "🛒"}
                  {item.title === "Reports" && "▥"}
                  {item.title === "Notifications" && "♧"}
                </span>
                {item.title}
              </button>
            ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">i</span>
            <div>
              <strong>Facility operations</strong>
              <small>Manage everything in one place.</small>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Workspace / <strong>Dashboard</strong>
            </div>
            <h1>Dashboard Overview</h1>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{username}</strong>
              <span>Facility Administrator</span>
            </div>
            <button className="topbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="welcome-banner">
            <div>
              <span className="welcome-eyebrow">FACILITY OPERATIONS</span>
              <h2>Welcome back, {username}!</h2>
              <p>
                Here's your overview of facility management and operational
                resources.
              </p>
              <button
                className="welcome-button"
                onClick={() => navigate("/employees")}
              >
                Explore Employees <span>→</span>
              </button>
            </div>

            <div className="welcome-decoration" aria-hidden="true">
              <div className="decoration-building">▥</div>
              <span className="decoration-dot dot-one" />
              <span className="decoration-dot dot-two" />
              <span className="decoration-dot dot-three" />
            </div>
          </div>

          <div className="section-heading">
            <div>
              <h2>Key Metrics</h2>
              <p>Your organization at a glance</p>
            </div>
            <span className="date-label">{currentDate}</span>
          </div>

          <div className="metrics-grid">
            <button
              className="metric-card"
              onClick={() => navigate("/employees")}
            >
              <div className="metric-top">
                <span className="metric-icon purple">♙</span>
                <span className="metric-arrow">↗</span>
              </div>
              <span className="metric-title">Total Employees</span>
              <strong className="metric-value">
                {renderCount(employeeLoading, employeeCount)}
              </strong>
              <span className="metric-footnote">Registered employees</span>
            </button>

            <button
              className="metric-card"
              onClick={() => navigate("/locations")}
            >
              <div className="metric-top">
                <span className="metric-icon blue">⌂</span>
                <span className="metric-arrow">↗</span>
              </div>
              <span className="metric-title">Facility Locations</span>
              <strong className="metric-value">
                {renderCount(locationLoading, locationCount)}
              </strong>
              <span className="metric-footnote">Registered locations</span>
            </button>

            <button className="metric-card" onClick={() => navigate("/assets")}>
              <div className="metric-top">
                <span className="metric-icon cyan">▣</span>
                <span className="metric-arrow">↗</span>
              </div>
              <span className="metric-title">Asset Management</span>
              <strong className="metric-value metric-label">Assets</strong>
              <span className="metric-footnote">View facility assets</span>
            </button>

            <button
              className="metric-card"
              onClick={() => navigate("/maintenance")}
            >
              <div className="metric-top">
                <span className="metric-icon orange">⚙</span>
                <span className="metric-arrow">↗</span>
              </div>
              <span className="metric-title">Maintenance</span>
              <strong className="metric-value metric-label">Operations</strong>
              <span className="metric-footnote">Requests and work orders</span>
            </button>
          </div>

          <div className="section-heading module-heading">
            <div>
              <h2>Facility Modules</h2>
              <p>Access your facility management tools</p>
            </div>
          </div>

          <div className="modules-grid">
            {modules.map((item) => (
              <button
                className="module-card"
                key={item.title}
                onClick={() => navigate(item.path)}
              >
                <div className="module-card-top">
                  <span className={`module-icon ${item.color}`}>
                    {item.icon === "users" && "♙"}
                    {item.icon === "building" && "⌂"}
                    {item.icon === "monitor" && "▣"}
                    {item.icon === "wrench" && "⚙"}
                    {item.icon === "package" && "▤"}
                    {item.icon === "shopping-cart" && "🛒"}
                    {item.icon === "chart" && "▥"}
                    {item.icon === "bell" && "♧"}
                  </span>
                  <span className="module-arrow">↗</span>
                </div>

                <strong>{item.title}</strong>
                <p>{item.description}</p>

                <span className="module-action">{item.action} →</span>
              </button>
            ))}
          </div>

          <footer className="dashboard-footer">
            <span>FacilityERP</span>
            <span>Facility Management Platform</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
