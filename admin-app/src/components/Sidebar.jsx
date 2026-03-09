import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Map as MapIcon,
    Users,
    LogOut
} from 'lucide-react';
// Assume the user copied linel.png into admin-app/src/assets or we can use an absolute path for now.
// I will just use an img tag with the absolute path directly for testing, or assume it's in public.

const Sidebar = ({ onLogout, user }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/linel.png" alt="DoctorApp Logo" style={{ height: '80px', width: '100%', objectFit: 'contain' }} />
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
