import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: 'DRIVER',
        profilePicture: '' // This will store the Base64 string
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit check
                setError('File size too large. Please select an image under 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/register', formData);
            if (response.data.success) {
                const { token, user } = response.data.data;
                login(token, user);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                
                {/* Profile Picture Preview */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                            src={formData.profilePicture || `https://ui-avatars.com/api/?name=${formData.userName || 'User'}&background=random&size=128`} 
                            alt="Preview" 
                            style={{ 
                                width: '100px', 
                                height: '100px', 
                                borderRadius: '50%', 
                                objectFit: 'cover',
                                border: '3px solid #4f46e5'
                            }} 
                        />
                        <label htmlFor="file-upload" style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: '#4f46e5',
                            color: 'white',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px solid white'
                        }}>
                            +
                        </label>
                        <input 
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Click the + to upload a photo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="userName"
                            className="form-control"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Pick a unique username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="DRIVER">Driver</option>
                            <option value="CONTROLLER">Controller</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">Get Started</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                    Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
