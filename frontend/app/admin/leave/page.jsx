"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./leave.css";

export default function AdminLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState({});

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data);
    } catch {
      setError("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, {
        status,
        adminComment: comment[id],
      });
      fetchLeaves();
    } catch {
      alert("Failed to update leave");
    }
  };

  if (loading) {
    return <div className="leave-admin-page">Loading leave requests...</div>;
  }

  if (error) {
    return <div className="leave-admin-page error">{error}</div>;
  }

  return (
    <div className="leave-admin-page">
      <h1>Leave Approvals</h1>

      <table className="leave-admin-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Admin Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td>{l.employee?.fullName}</td>
              <td>{l.employee?.user?.email}</td>
              <td>{l.type}</td>
              <td>{new Date(l.fromDate).toLocaleDateString()}</td>
              <td>{new Date(l.toDate).toLocaleDateString()}</td>
              <td>
                <span className={`status ${l.status.toLowerCase()}`}>
                  {l.status}
                </span>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Optional"
                  value={comment[l._id] || ""}
                  onChange={(e) =>
                    setComment({ ...comment, [l._id]: e.target.value })
                  }
                  disabled={l.status !== "PENDING"}
                />
              </td>
              <td>
                {l.status === "PENDING" ? (
                  <>
                    <button
                      className="approve"
                      onClick={() => updateStatus(l._id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(l._id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
