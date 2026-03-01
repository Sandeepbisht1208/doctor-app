import React, { useState, useEffect } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import { adminService } from '../services/api';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const res = await adminService.getRequests();
            setRequests(res.data.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await adminService.updateStatus(id, status);
            loadRequests();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleExport = async () => {
        try {
            const response = await adminService.exportRequests();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `requests-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Export failed");
        }
    };

    const filteredRequests = requests.filter((req) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (req.patient_name && req.patient_name.toLowerCase().includes(q)) ||
            (req.patient_phone && req.patient_phone.toLowerCase().includes(q))
        );
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Request Management</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleExport}
                        style={{
                            background: 'var(--success)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Export CSV
                    </button>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                color: 'white',
                                width: '300px'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Service Type</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((req) => (
                            <tr key={req.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{req.patient_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{req.patient_phone}</div>
                                </td>
                                <td style={{ textTransform: 'capitalize' }}>
                                    {req.service_type} {req.details?.emergency_type ? `(${req.details.emergency_type})` : ''}
                                </td>
                                <td>{req.details?.address || 'GPS Lock'}</td>
                                <td>
                                    <select
                                        value={req.status}
                                        onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                        className={`status-pill status-${req.status}`}
                                        style={{ border: 'none', appearance: 'none', cursor: 'pointer', background: 'transparent' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="on_the_way">On Way</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>{req.staff_name || '-'}</td>
                                <td><MoreVertical size={20} color="var(--text-dim)" cursor="pointer" /></td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && !loading && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                    {searchQuery ? `No results for "${searchQuery}"` : 'No requests found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Requests;
