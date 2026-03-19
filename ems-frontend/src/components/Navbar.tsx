import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/dashboard" className="navbar-brand">VMAS</Link>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/employees">Employees</Link>
                    {isAdmin && <Link to="/users">Users</Link>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid #e5e7eb', paddingLeft: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#111827', margin: 0 }}>{user?.userName}</p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{user?.role}</p>
                        </div>
                        <img
                            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.userName}&background=random`}
                            alt="profile"
                            className="profile-image-small"
                        />
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.75rem' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
