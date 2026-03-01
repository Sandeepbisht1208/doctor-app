import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, SignalHigh, AlertCircle, Loader } from 'lucide-react';
import { adminService } from '../services/api';

const MapCenter = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const res = await adminService.getRequests();
                // Filter for ambulance requests that are not yet completed/cancelled
                const active = res.data.data.filter(
                    (r) => r.service_type === 'ambulance' && !['completed', 'cancelled'].includes(r.status)
                );
                setEmergencies(active);
            } catch (error) {
                console.error('Failed to fetch emergencies', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmergencies();
        // Refresh every 30 seconds
        const interval = setInterval(fetchEmergencies, 30000);
        return () => clearInterval(interval);
    }, []);

    const positions = [
        { top: '30%', left: '40%' },
        { top: '60%', left: '55%' },
        { top: '45%', left: '25%' },
        { top: '20%', left: '65%' },
    ];

    return (
        <div style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Emergency Map Center</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="status-pill status-emergency" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SignalHigh size={14} /> LIVE TRACKING
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                        {emergencies.length} Active
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
                {/* Map Background */}
                <div style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '1.5rem',
                    border: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>
                            <Loader size={20} />
                            Loading live data...
                        </div>
                    )}

                    {!loading && emergencies.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                            <MapPin size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <div>No active emergencies</div>
                        </div>
                    )}

                    {!loading && emergencies.map((em, i) => {
                        const pos = positions[i % positions.length];
                        return (
                            <div key={em.id} style={{
                                position: 'absolute',
                                top: pos.top,
                                left: pos.left,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{ background: 'var(--error)', padding: '5px', borderRadius: '50%', boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                                    <MapPin size={24} color="white" />
                                </div>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border)',
                                    marginTop: '10px',
                                    fontSize: '0.75rem',
                                    minWidth: '120px',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    <div style={{ fontWeight: 'bold' }}>{em.patient_name || 'Unknown Patient'}</div>
                                    <div style={{ color: 'var(--error)' }}>{em.patient_phone}</div>
                                    <div style={{ color: 'var(--text-dim)', marginTop: '2px', textTransform: 'capitalize' }}>
                                        {em.status.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar */}
                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Active Dispatch</h2>

                    {loading && (
                        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
                            Loading...
                        </div>
                    )}

                    {!loading && emergencies.length === 0 && (
                        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>
                            All clear – no active ambulance dispatches
                        </div>
                    )}

                    {emergencies.map((em) => (
                        <div key={em.id} className="stats-card" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                    #{em.id.toString().slice(0, 8)}
                                </span>
                                <span className={`status-pill ${em.status === 'on_the_way' ? 'status-emergency' : 'status-pending'}`}>
                                    {em.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{em.patient_name || 'Unknown'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{em.patient_phone}</div>
                            <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
                                <AlertCircle size={14} />
                                Ambulance Request
                            </div>
                            {em.staff_name && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                                    Assigned: {em.staff_name}
                                </div>
                            )}
                            <button style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: 'var(--glass)',
                                border: '1px solid var(--border)',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}>
                                <Navigation size={14} />
                                Track Driver
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapCenter;
