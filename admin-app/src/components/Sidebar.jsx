import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Map as MapIcon,
    Users,
    LogOut,
    HeartPulse
} from 'lucide-react';

const Sidebar = ({ onLogout, user }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <HeartPulse size={32} />
                <span>DoctorApp</span>
            </div>

            <nav className="nav-links">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </NavLink>

                <NavLink to="/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ClipboardList size={20} />
                    <span>Requests</span>
                </NavLink>

                <NavLink to="/map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MapIcon size={20} />
                    <span>Map Center</span>
                </NavLink>

                <NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Manage Staff</span>
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto' }}>
                {user && (
                    <div style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        Logged in as<br />
                        <strong style={{ color: '#f8fafc' }}>{user.phone}</strong>
                    </div>
                )}
                <button
                    id="admin-logout-btn"
                    onClick={onLogout}
                    className="nav-item"
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
