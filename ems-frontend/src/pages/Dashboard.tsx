import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            {/* Header / Profile Section */}
            <div className="profile-section">
                <img 
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.userName}&background=random&size=128`} 
                    alt="Profile" 
                    className="profile-image-large"
                />
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                        Hello, {user?.userName}!
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                        Welcome to your V-MAS Control Center.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Status Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Account Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={`status-badge ${user?.accountStatus === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                            {user?.accountStatus}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>ID: #{user?.id}</span>
                    </div>
                </div>

                {/* Role Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: '#374151' }}>System Role</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="role-badge" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Email Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Connected Email</h3>
                    <p style={{ fontWeight: '500', color: '#111827' }}>{user?.email}</p>
                </div>
            </div>

            {/* Quick Actions or Statistics could go here */}
            <div className="card" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Get Started</h2>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Access your vehicle management tools from the navigation bar above.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn" style={{ width: 'auto' }}>View Vehicles</button>
                    <button className="btn" style={{ width: 'auto', background: '#f3f4f6', color: '#111827' }}>Support</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
