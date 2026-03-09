import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    AlertCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { adminService } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [detailed, setDetailed] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, reqsRes, detailedRes] = await Promise.all([
                    adminService.getAnalytics(),
                    adminService.getRequests(),
                    adminService.getDetailedAnalytics()
                ]);
                setAnalytics(statsRes.data.data);
                setRequests(reqsRes.data.data.slice(0, 5));
                setDetailed(detailedRes.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: "Today's Requests", value: analytics?.today || "0", icon: TrendingUp, color: "var(--primary)" },
        { label: "Pending Approval", value: analytics?.pending || "0", icon: Clock, color: "var(--warning)" },
        { label: "Active Emergencies", value: analytics?.emergency || "0", icon: AlertCircle, color: "var(--error)" },
        { label: "Completed Visits", value: analytics?.completed || "0", icon: CheckCircle2, color: "var(--success)" },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stats-card">
                        <h3>{stat.label}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <span className="value">{stat.value}</span>
                            <stat.icon size={24} color={stat.color} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="stats-card" style={{ minHeight: '350px', height: '400px' }}>
                    <h3>Request Trends (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={detailed?.monthlyTrends || []}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="var(--text-dim)" fontSize={12} />
                            <YAxis stroke="var(--text-dim)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-card" style={{ minHeight: '350px', height: '400px' }}>
                    <h3>Service Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={detailed?.serviceDistribution || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {detailed?.serviceDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-container">
                <h2>Live Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id}>
                                <td>#{req.id.toString().slice(0, 6)}</td>
                                <td>{req.patient_name}</td>
                                <td style={{ textTransform: 'capitalize' }}>{req.service_type}</td>
                                <td>
                                    <span className={`status-pill status-${req.status}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No active requests</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
