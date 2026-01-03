"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./leave.css";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [type, setType] = useState("PAID");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    const res = await api.get("/leaves/me");
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const applyLeave = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/leaves", {
        type,
        fromDate,
        toDate,
        reason,
      });
      setMessage("Leave request submitted");
      setFromDate("");
      setToDate("");
      setReason("");
      fetchLeaves();
    } catch {
      setMessage("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-page">
      <h1>Leave Management</h1>

      <form className="leave-form" onSubmit={applyLeave}>
        <h2>Apply for Leave</h2>

        <label>Leave Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="PAID">Paid Leave</option>
          <option value="SICK">Sick Leave</option>
          <option value="UNPAID">Unpaid Leave</option>
        </select>

        <label>From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          required
        />

        <label>To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          required
        />

        <label>Reason</label>
        <textarea
          placeholder="Optional"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Apply Leave"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <h2 className="history-title">Leave History</h2>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Admin Comment</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td>{l.type}</td>
              <td>{new Date(l.fromDate).toLocaleDateString()}</td>
              <td>{new Date(l.toDate).toLocaleDateString()}</td>
              <td>
                <span className={`status ${l.status.toLowerCase()}`}>
                  {l.status}
                </span>
              </td>
              <td>{l.adminComment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
