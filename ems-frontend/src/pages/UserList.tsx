import React, { useEffect, useState } from 'react';
import api from '../api/api';

interface User {
    id: number;
    userName: string;
    email: string;
    role: string;
    accountStatus: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (err: any) {
                setError('Failed to fetch users. You might not have permission.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="container dashboard-container">
            <h2>User Management</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td><span className="role-badge">{user.role}</span></td>
                            <td>
                                <span className={`status-badge ${user.accountStatus === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                                    {user.accountStatus}
                                </span>
                            </td>
                            <td>
                                <button className="btn" style={{ width: 'auto', display: 'inline-block', marginRight: '5px' }}>Edit</button>
                                <button className="btn btn-danger" style={{ width: 'auto', display: 'inline-block' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
