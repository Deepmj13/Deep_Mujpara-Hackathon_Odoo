"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./employees.css";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="employees-page">Loading employees...</div>;
  }

  if (error) {
    return <div className="employees-page error">{error}</div>;
  }

  return (
    <div className="employees-page">
      <h1>Employees</h1>

      <table className="employees-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.user?.email}</td>
              <td>{emp.user?.role}</td>
              <td>{emp.department || "-"}</td>
              <td>{emp.designation || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
