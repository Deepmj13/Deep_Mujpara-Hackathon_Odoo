"use client";

import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function EmployeeDashboard() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "user=; Max-Age=0; path=/";
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <h2>Dayflow HRMS</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <main className="content">
        <h1>Welcome, {user?.email}</h1>

        <div className="cards">
          <div
            className="card"
            onClick={() => router.push("/employee/attendance")}
          >
            <h3>Attendance</h3>
            <p>Check-in / Check-out & history</p>
          </div>

          <div
            className="card"
            onClick={() => router.push("/employee/leave")}
          >
            <h3>Leave</h3>
            <p>Apply & track leave requests</p>
          </div>

          <div
            className="card"
            onClick={() => router.push("/employee/payroll")}
          >
            <h3>Payroll</h3>
            <p>View salary & deductions</p>
          </div>
        </div>
      </main>
    </div>
  );
}
