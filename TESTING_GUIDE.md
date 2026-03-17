# VMAS - Vehicle Management Authentication System
## Testing Guide

### 🚀 Quick Start

**Application is running on:** `http://localhost:8080`
**Database:** `vmas_db` (MySQL on XAMPP)

---

## 📋 Testing Steps for Postman

### Step 1: Register Users

#### 1.1 Register ADMIN User
**Endpoint:** POST `http://localhost:8080/api/auth/register`
```json
{
    "userName": "admin",
    "email": "admin@vmas.com",
    "password": "admin123",
    "role": "ADMIN",
    "profilePicture": "https://example.com/admin.jpg"
}
```
**Expected Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userName": "admin",
    "role": "ADMIN",
    "message": "Registration successful"
}
```
**Action:** Copy the `token` value - this is your ADMIN token!

---

#### 1.2 Register CONTROLLER User
**Endpoint:** POST `http://localhost:8080/api/auth/register`
```json
{
    "userName": "controller",
    "email": "controller@vmas.com",
    "password": "controller123",
    "role": "CONTROLLER",
    "profilePicture": "https://example.com/controller.jpg"
}
```

---

#### 1.3 Register DRIVER User
**Endpoint:** POST `http://localhost:8080/api/auth/register`
```json
{
    "userName": "driver",
    "email": "driver@vmas.com",
    "password": "driver123",
    "role": "DRIVER",
    "profilePicture": "https://example.com/driver.jpg"
}
```
**Action:** Copy the DRIVER `token` for RBAC testing!

---

### Step 2: Login (Alternative to Registration)

#### 2.1 Login as ADMIN
**Endpoint:** POST `http://localhost:8080/api/auth/login`
```json
{
    "userName": "admin",
    "password": "admin123"
}
```

---

### Step 3: Test ADMIN Operations (Protected Routes)

#### 3.1 Get All Users (ADMIN Only)
**Endpoint:** GET `http://localhost:8080/api/users`
**Headers:**
- `Authorization: Bearer YOUR_ADMIN_TOKEN_HERE`

**Expected Response:**
```json
[
    {
        "id": 1,
        "userName": "admin",
        "email": "admin@vmas.com",
        "role": "ADMIN",
        "accountStatus": "ACTIVE",
        "profilePicture": "https://example.com/admin.jpg"
    },
    {
        "id": 2,
        "userName": "controller",
        "email": "controller@vmas.com",
        "role": "CONTROLLER",
        "accountStatus": "ACTIVE",
        "profilePicture": "https://example.com/controller.jpg"
    },
    {
        "id": 3,
        "userName": "driver",
        "email": "driver@vmas.com",
        "role": "DRIVER",
        "accountStatus": "ACTIVE",
        "profilePicture": "https://example.com/driver.jpg"
    }
]
```

---

#### 3.2 Get User By ID
**Endpoint:** GET `http://localhost:8080/api/users/1`
**Headers:**
- `Authorization: Bearer YOUR_ADMIN_TOKEN_HERE`

---

#### 3.3 Create User Manually (ADMIN Only)
**Endpoint:** POST `http://localhost:8080/api/users`
**Headers:**
- `Authorization: Bearer YOUR_ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Body:**
```json
{
    "userName": "newdriver",
    "email": "newdriver@vmas.com",
    "password": "newdriver123",
    "role": "DRIVER",
    "profilePicture": "https://example.com/newdriver.jpg"
}
```

---

#### 3.4 Update User (ADMIN Only)
**Endpoint:** PUT `http://localhost:8080/api/users/1`
**Headers:**
- `Authorization: Bearer YOUR_ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Body:**
```json
{
    "userName": "admin",
    "email": "admin@vmas.com",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "profilePicture": "https://example.com/admin-updated.jpg"
}
```

---

#### 3.5 Delete User (ADMIN Only)
**Endpoint:** DELETE `http://localhost:8080/api/users/4`
**Headers:**
- `Authorization: Bearer YOUR_ADMIN_TOKEN_HERE`

**Expected Response:**
```json
"User deleted successfully"
```

---

### Step 4: Test RBAC (Role-Based Access Control)

#### 4.1 DRIVER tries to access ALL Users (Should FAIL - 403 Forbidden)
**Endpoint:** GET `http://localhost:8080/api/users`
**Headers:**
- `Authorization: Bearer YOUR_DRIVER_TOKEN_HERE`

**Expected Response:**
```json
{
    "timestamp": "2026-03-17T04:50:00.000+00:00",
    "status": 403,
    "error": "Forbidden",
    "message": "You don't have permission to access this resource",
    "path": "/api/users"
}
```

---

#### 4.2 DRIVER updates OWN profile (Should SUCCESS)
**Endpoint:** PUT `http://localhost:8080/api/users/3`
**Headers:**
- `Authorization: Bearer YOUR_DRIVER_TOKEN_HERE`
- `Content-Type: application/json`

**Body:**
```json
{
    "userName": "driver",
    "email": "driver@vmas.com",
    "role": "DRIVER",
    "accountStatus": "ACTIVE",
    "profilePicture": "https://example.com/driver-updated.jpg"
}
```
**Expected:** ✅ Success (200 OK)

---

#### 4.3 DRIVER tries to update ANOTHER user (Should FAIL - 403 Forbidden)
**Endpoint:** PUT `http://localhost:8080/api/users/1`
**Headers:**
- `Authorization: Bearer YOUR_DRIVER_TOKEN_HERE`

**Expected:** ❌ 403 Forbidden

---

#### 4.4 DRIVER tries to DELETE any user (Should FAIL - 403 Forbidden)
**Endpoint:** DELETE `http://localhost:8080/api/users/1`
**Headers:**
- `Authorization: Bearer YOUR_DRIVER_TOKEN_HERE`

**Expected:** ❌ 403 Forbidden

---

#### 4.5 Request without Token (Should FAIL - 401 Unauthorized)
**Endpoint:** GET `http://localhost:8080/api/users`
**Headers:** (No Authorization header)

**Expected Response:**
```json
{
    "timestamp": "2026-03-17T04:50:00.000+00:00",
    "status": 401,
    "error": "Unauthorized",
    "message": "Full authentication is required to access this resource",
    "path": "/api/users"
}
```

---

## 🔐 Security Features Implemented

1. ✅ **BCrypt Password Hashing** - Passwords stored securely
2. ✅ **JWT Authentication** - Token-based auth with 24-hour expiration
3. ✅ **Role-Based Access Control (RBAC)**
   - ADMIN: Full access to all operations
   - CONTROLLER: Can view and update own profile
   - DRIVER: Can view and update own profile
4. ✅ **CORS Configuration** - Allows React frontend (localhost:3000)
5. ✅ **Global Exception Handling**
   - 401 Unauthorized
   - 403 Forbidden
   - 404 Not Found

---

## 📊 Database Schema

**Table:** `users`
- `id` (BIGINT, Primary Key, Auto-increment)
- `user_name` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Encrypted, Not Null)
- `role` (ENUM: ADMIN, CONTROLLER, DRIVER)
- `account_status` (ENUM: ACTIVE, INACTIVE, SUSPENDED)
- `profile_picture` (VARCHAR, Nullable)

---

## 🎯 Testing Checklist

- [ ] Register ADMIN user
- [ ] Register CONTROLLER user
- [ ] Register DRIVER user
- [ ] Login as ADMIN and get token
- [ ] Login as DRIVER and get token
- [ ] ADMIN: Get all users
- [ ] ADMIN: Create new user
- [ ] ADMIN: Update user
- [ ] ADMIN: Delete user
- [ ] DRIVER: Try to get all users (expect 403)
- [ ] DRIVER: Update own profile (expect 200)
- [ ] DRIVER: Try to update other user (expect 403)
- [ ] DRIVER: Try to delete user (expect 403)
- [ ] No token: Try any protected endpoint (expect 401)

---

## 🛠️ Troubleshooting

### Issue: "401 Unauthorized" on login
**Solution:** Check username and password are correct

### Issue: "403 Forbidden" on operation
**Solution:** Your role doesn't have permission for this operation

### Issue: Token expired
**Solution:** Login again to get a new token (valid for 24 hours)

### Issue: "Username already exists"
**Solution:** Use a different username

---

## 📝 Notes

- Tokens expire after 24 hours (86400000 ms)
- Always include `Authorization: Bearer <token>` header for protected endpoints
- JWT Secret is stored in application.properties
- Database auto-creates tables on first run

---

## ✅ Success!

Your VMAS backend is now fully functional with:
- JWT Authentication
- Role-Based Access Control
- Secure password hashing
- Global exception handling
- CORS configuration for React frontend
