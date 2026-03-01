import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login({ onLogin }) {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/send-otp`, { phone });
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
        setLoading(false);
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
            const { token, user } = res.data;

            if (user.role !== 'admin') {
                setError('Access denied: Admin accounts only.');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
        setLoading(false);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🏥</span>
                    <span>Doctor App</span>
                </div>
                <h2 style={styles.title}>Admin Portal</h2>
                <p style={styles.subtitle}>
                    {step === 'phone' ? 'Enter your admin phone number to continue' : `OTP sent to ${phone}`}
                </p>

                {error && <div style={styles.errorBanner}>{error}</div>}

                {step === 'phone' ? (
                    <form onSubmit={sendOTP} style={styles.form}>
                        <label style={styles.label}>Phone Number</label>
                        <input
                            id="admin-phone-input"
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            style={styles.input}
                            required
                            autoFocus
                        />
                        <button
                            id="send-otp-btn"
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP →'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOTP} style={styles.form}>
                        <label style={styles.label}>Enter 6-digit OTP</label>
                        <input
                            id="admin-otp-input"
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="······"
                            maxLength={6}
                            style={{ ...styles.input, letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.5rem' }}
                            required
                            autoFocus
                        />
                        <button
                            id="verify-otp-btn"
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Login →'}
                        </button>
                        <button
                            type="button"
                            style={styles.backBtn}
                            onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                        >
                            ← Change number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '1rem',
    },
    card: {
        background: 'rgba(30, 41, 59, 0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1.5rem',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#6366f1',
        marginBottom: '1.5rem',
    },
    logoIcon: {
        fontSize: '1.8rem',
    },
    title: {
        color: '#f8fafc',
        fontSize: '1.75rem',
        fontWeight: '700',
        margin: '0 0 0.5rem',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '0.95rem',
        margin: '0 0 2rem',
    },
    errorBanner: {
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '0.75rem',
        color: '#ef4444',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        marginBottom: '1.25rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    label: {
        color: '#94a3b8',
        fontSize: '0.875rem',
        fontWeight: '500',
    },
    input: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '0.75rem',
        color: '#f8fafc',
        fontSize: '1rem',
        padding: '0.875rem 1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none',
        borderRadius: '0.75rem',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        padding: '0.875rem',
        transition: 'opacity 0.2s',
        marginTop: '0.5rem',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '0.875rem',
        textAlign: 'center',
        padding: '0.25rem',
    },
};
