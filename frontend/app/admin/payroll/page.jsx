"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./payroll.css";

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [empRes, payRes] = await Promise.all([
      api.get("/employees"),
      api.get("/payroll"),
    ]);
    setEmployees(empRes.data);
    setPayrolls(payRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitPayroll = async (e) => {
    e.preventDefault();

    await api.post("/payroll", {
      employeeId: form.employeeId,
      basicSalary: Number(form.basicSalary),
      allowances: Number(form.allowances),
      deductions: Number(form.deductions),
    });

    setForm({
      employeeId: "",
      basicSalary: "",
      allowances: "",
      deductions: "",
    });

    fetchData();
  };

  if (loading) {
    return <div className="admin-payroll-page">Loading payroll...</div>;
  }

  return (
    <div className="admin-payroll-page">
      <h1>Payroll Management</h1>

      {/* Payroll Form */}
      <form className="payroll-form" onSubmit={submitPayroll}>
        <h2>Assign / Update Payroll</h2>

        <label>Employee</label>
        <select
          value={form.employeeId}
          onChange={(e) =>
            setForm({ ...form, employeeId: e.target.value })
          }
          required
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>
              {e.fullName} ({e.user?.email})
            </option>
          ))}
        </select>

        <label>Basic Salary</label>
        <input
          type="number"
          value={form.basicSalary}
          onChange={(e) =>
            setForm({ ...form, basicSalary: e.target.value })
          }
          required
        />

        <label>Allowances</label>
        <input
          type="number"
          value={form.allowances}
          onChange={(e) =>
            setForm({ ...form, allowances: e.target.value })
          }
        />

        <label>Deductions</label>
        <input
          type="number"
          value={form.deductions}
          onChange={(e) =>
            setForm({ ...form, deductions: e.target.value })
          }
        />

        <button type="submit">Save Payroll</button>
      </form>

      {/* Payroll Table */}
      <h2 className="table-title">Employee Payrolls</h2>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Basic</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((p) => (
            <tr key={p._id}>
              <td>{p.employee?.fullName}</td>
              <td>{p.employee?.user?.email}</td>
              <td>₹ {p.basicSalary}</td>
              <td>₹ {p.allowances}</td>
              <td>₹ {p.deductions}</td>
              <td>
                <strong>₹ {p.netSalary}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
