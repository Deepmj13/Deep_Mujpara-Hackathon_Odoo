"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./attendance.css";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAttendance = async () => {
    const res = await api.get("/attendance/me");
    setAttendance(res.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await api.post("/attendance/check-in");
      setMessage("Checked in successfully");
      fetchAttendance();
    } catch {
      setMessage("Already checked in today");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await api.post("/attendance/check-out");
      setMessage("Checked out successfully");
      fetchAttendance();
    } catch {
      setMessage("Please check in first");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <h1>Attendance</h1>

      <div className="actions">
        <button onClick={handleCheckIn} disabled={loading}>
          Check In
        </button>
        <button onClick={handleCheckOut} disabled={loading}>
          Check Out
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a._id}>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td>
                {a.checkIn
                  ? new Date(a.checkIn).toLocaleTimeString()
                  : "-"}
              </td>
              <td>
                {a.checkOut
                  ? new Date(a.checkOut).toLocaleTimeString()
                  : "-"}
              </td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
