import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";

import EmployeeList from "./pages/Employees/EmployeeList";
import EmployeeForm from "./pages/Employees/EmployeeForm";
import EmployeeDetails from "./pages/Employees/EmployeeDetails";
import EmployeeEdit from "./pages/Employees/EmployeeEdit";

// Assets Module
import AssetList from "./pages/Assets/AssetList";
import MaintenanceList from "./pages/Maintenance/MaintenanceList";
import InventoryList from "./pages/Inventory/InventoryList";
import ProcurementList from "./pages/Procurement/ProcurementList";
import ReportsPage from "./pages/Reports/ReportsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Employee Routes */}
        <Route path="/employees" element={<EmployeeList />} />

        <Route path="/employees/add" element={<EmployeeForm />} />

        <Route path="/employees/:id" element={<EmployeeDetails />} />

        <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

        {/* Assets Route */}
        <Route path="/assets" element={<AssetList />} />

        <Route path="/maintenance" element={<MaintenanceList />} />

        <Route path="/inventory" element={<InventoryList />} />

        <Route path="/procurement" element={<ProcurementList />} />

        <Route path="/reports" element={<ReportsPage />} />

        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
