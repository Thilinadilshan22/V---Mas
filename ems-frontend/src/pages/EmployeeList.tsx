import React, { useEffect, useState } from 'react';
import api from '../api/api';

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employees');
                if (response.data.success) {
                    setEmployees(response.data.data);
                }
            } catch (err: any) {
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="container dashboard-container">
            <h2>Employee Management</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.firstName}</td>
                            <td>{emp.lastName}</td>
                            <td>{emp.email}</td>
                            <td>
                                <button className="btn" style={{ width: 'auto', display: 'inline-block', marginRight: '5px' }}>Edit</button>
                                <button className="btn btn-danger" style={{ width: 'auto', display: 'inline-block' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {employees.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>No employees found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
