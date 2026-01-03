"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./attendance.css";

export default function AdminAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance");
      setRecords(res.data);
    } catch {
      setError("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return <div className="admin-attendance-page">Loading attendance...</div>;
  }

  if (error) {
    return <div className="admin-attendance-page error">{error}</div>;
  }

  return (
    <div className="admin-attendance-page">
      <h1>Attendance Records</h1>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.employee?.fullName}</td>
              <td>{r.employee?.user?.email}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>
                {r.checkIn
                  ? new Date(r.checkIn).toLocaleTimeString()
                  : "-"}
              </td>
              <td>
                {r.checkOut
                  ? new Date(r.checkOut).toLocaleTimeString()
                  : "-"}
              </td>
              <td>
                <span className={`status ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
