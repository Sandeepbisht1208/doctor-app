import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, UserX, Shield } from 'lucide-react';
import { adminService } from '../services/api';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const res = await adminService.getStaff();
            setStaff(res.data.data);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Staff Management</h1>
                <button style={{
                    background: 'var(--primary)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.25rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 600
                }}>
                    <UserPlus size={18} />
                    Add New Staff
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member) => (
                            <tr key={member.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{member.name}</div>
                                </td>
                                <td>
                                    <div style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Shield size={14} color="var(--primary)" />
                                        {member.role}
                                    </div>
                                </td>
                                <td>{member.phone}</td>
                                <td>
                                    <span className={`status-pill status-${member.status === 'active' ? 'completed' :
                                            member.status === 'busy' ? 'emergency' : 'pending'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ background: 'none', border: '1px solid var(--border)', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>
                                            <UserCheck size={16} color="var(--success)" />
                                        </button>
                                        <button style={{ background: 'none', border: '1px solid var(--border)', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>
                                            <UserX size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
