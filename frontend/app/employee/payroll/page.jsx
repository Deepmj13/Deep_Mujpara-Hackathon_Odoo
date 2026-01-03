
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import "./payroll.css";

export default function PayrollPage() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayroll = async () => {
    try {
      const res = await api.get("/payroll/me");
      setPayroll(res.data);
    } catch (err) {
      setError("Payroll not available yet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  if (loading) {
    return <div className="payroll-page">Loading payroll...</div>;
  }

  if (error) {
    return <div className="payroll-page error">{error}</div>;
  }

  return (
    <div className="payroll-page">
      <h1>Payroll</h1>

      <div className="payroll-card">
        <div className="row">
          <span>Basic Salary</span>
          <span>₹ {payroll.basicSalary}</span>
        </div>

        <div className="row">
          <span>Allowances</span>
          <span>₹ {payroll.allowances}</span>
        </div>

        <div className="row">
          <span>Deductions</span>
          <span>₹ {payroll.deductions}</span>
        </div>

        <div className="row">
          <span>Net Salary</span>
          <span>₹ {payroll.netSalary}</span>
        </div>

        <hr />

        <div className="row deduction">
          <span>Attendance Deduction</span>
          <span>- ₹ {payroll.attendanceDeduction}</span>
        </div>

        <div className="row final">
          <span>Final Payable</span>
          <span>₹ {payroll.finalPayable}</span>
        </div>
      </div>
    </div>
  );
}
