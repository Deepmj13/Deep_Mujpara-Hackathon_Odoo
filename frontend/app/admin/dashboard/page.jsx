
"use client";

import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function AdminDashboard() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "user=; Max-Age=0; path=/";
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <h2>Dayflow HRMS — Admin</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <main className="admin-content">
        <h1>Welcome, {user?.email}</h1>
        <p className="subtitle">HR & Administration Panel</p>

        <div className="admin-cards">
          <div
            className="admin-card"
            onClick={() => router.push("/admin/employees")}
          >
            <h3>Employees</h3>
            <p>View & manage employees</p>
          </div>

          <div
            className="admin-card"
            onClick={() => router.push("/admin/attendance")}
          >
            <h3>Attendance</h3>
            <p>Monitor attendance records</p>
          </div>

          <div
            className="admin-card"
            onClick={() => router.push("/admin/leave")}
          >
            <h3>Leave Approvals</h3>
            <p>Approve or reject leave requests</p>
          </div>

          <div
            className="admin-card"
            onClick={() => router.push("/admin/payroll")}
          >
            <h3>Payroll</h3>
            <p>Manage salaries & deductions</p>
          </div>
        </div>
      </main>
    </div>
  );
}
