import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'

const UsersPage = () => {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: 'DRIVER',
    accountStatus: 'ACTIVE',
    profilePicture: ''
  })

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  const loadUsers = async () => {
    try {
      setError('')
      const response = await userAPI.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      userName: '',
      email: '',
      password: '',
      role: 'DRIVER',
      accountStatus: 'ACTIVE',
      profilePicture: ''
    })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      userName: user.userName,
      email: user.email,
      password: '',
      role: user.role,
      accountStatus: user.accountStatus || 'ACTIVE',
      profilePicture: user.profilePicture || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await userAPI.deleteUser(id)
      await loadUsers()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const submitData = { ...formData }
      if (!submitData.profilePicture) {
        submitData.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(submitData.userName)}`
      }
      
      if (editingUser) {
        if (!submitData.password) {
          delete submitData.password
        }
        await userAPI.updateUser(editingUser.id, submitData)
      } else {
        await userAPI.createUser(submitData)
      }
      
      setShowModal(false)
      await loadUsers()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">Access Denied: Admin privileges required</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="users-page">
          <div className="page-header">
            <div>
              <h1>User Management</h1>
              <p>Manage system users and their roles</p>
            </div>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create New User
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="users-table">
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="loading">No users found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Avatar</th>
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
                      <td>
                        <img 
                          src={user.profilePicture} 
                          alt={user.userName} 
                          className="user-avatar"
                        />
                      </td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${user.accountStatus?.toLowerCase() || 'active'}`}>
                          {user.accountStatus || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {editingUser && '(leave empty to keep current)'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="DRIVER">Driver</option>
                  <option value="CONTROLLER">Controller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account Status</label>
                <select name="accountStatus" value={formData.accountStatus} onChange={handleChange}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Profile Picture URL (Optional)</label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersPage
