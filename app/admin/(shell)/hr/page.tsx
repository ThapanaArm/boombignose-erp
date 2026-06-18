"use client";

import { useState } from "react";
import { useErp } from "@/lib/store";
import { fmt } from "@/lib/format";
import { DEPTS } from "@/lib/data";
import Badge from "@/app/components/admin/Badge";
import Modal from "@/app/components/admin/Modal";

export default function HrPage() {
  const { employees, addEmployee } = useErp();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [dept, setDept] = useState(DEPTS[0]);
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState(25000);

  const handleAdd = () => {
    if (!name.trim()) {
      window.alert("Name is required.");
      return;
    }
    addEmployee({ name: name.trim(), dept, position: position.trim(), salary });
    setName(""); setPosition(""); setSalary(25000);
    setOpen(false);
  };

  return (
    <>
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-icon blue">👥</div>
          <div className="summary-text"><strong>48</strong><span>Total Employees</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon green">✅</div>
          <div className="summary-text"><strong>42</strong><span>Active</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon orange">🏖️</div>
          <div className="summary-text"><strong>6</strong><span>On Leave Today</span></div>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <h3>Employees</h3>
          <div className="table-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>+ Add Employee</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Department</th><th>Position</th><th>Salary</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.name}</strong>
                  <div style={{ fontSize: 11, color: "#8b8bac" }}>{e.id}</div>
                </td>
                <td>{e.dept}</td>
                <td>{e.position}</td>
                <td>{fmt(e.salary)}</td>
                <td><Badge status={e.status} /></td>
                <td><button className="btn btn-outline btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title="Add Employee"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Employee</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Firstname Lastname" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Position</label>
            <input type="text" placeholder="Job Title" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Salary (฿)</label>
            <input type="number" placeholder="25000" value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
          </div>
        </div>
      </Modal>
    </>
  );
}
