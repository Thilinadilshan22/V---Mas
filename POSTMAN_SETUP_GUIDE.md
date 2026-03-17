# 🔧 Postman Setup Guide - VMAS

## ⚠️ CRITICAL: All endpoints are WORKING! Follow these exact steps:

---

## Step 1: Register or Login to Get a Token

### Option A: Login (if users already exist)
**Request:**
```
Method: POST
URL: http://localhost:8080/api/auth/login
Headers:
  Content-Type: application/json

Body (raw JSON):
{
    "userName": "admin",
    "password": "admin123"
}
```

**Response (Example):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw",
    "userName": "admin",
    "role": "ADMIN",
    "message": "Login successful"
}
```

**👉 COPY THE TOKEN VALUE!** (the long string after "token":")

---

## Step 2: Use the Token in Protected Endpoints

### ⚠️ IMPORTANT: How to Add Authorization Header in Postman

For ALL user management endpoints, you MUST add the Authorization header:

1. Click on the **Headers** tab (below the URL bar)
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE` (include the word "Bearer" with a space)

**Example:**
```
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw
```

---

## Step 3: Test Each Endpoint

### 🔹 GET All Users

```
Method: GET
URL: http://localhost:8080/api/users

Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

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
    ...
]
```

---

### 🔹 GET User by ID

```
Method: GET
URL: http://localhost:8080/api/users/1

Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

---

### 🔹 CREATE User (POST)

```
Method: POST
URL: http://localhost:8080/api/users

Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  Content-Type: application/json

Body (raw JSON):
{
    "userName": "newuser",
    "email": "newuser@vmas.com",
    "password": "newuser123",
    "role": "DRIVER",
    "profilePicture": "https://example.com/newuser.jpg"
}
```

---

### 🔹 UPDATE User (PUT)

```
Method: PUT
URL: http://localhost:8080/api/users/1

Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  Content-Type: application/json

Body (raw JSON):
{
    "userName": "admin",
    "email": "admin@vmas.com",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "profilePicture": "https://example.com/admin-updated.jpg"
}
```

---

### 🔹 DELETE User

```
Method: DELETE
URL: http://localhost:8080/api/users/4

Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Expected Response:**
```
"User deleted successfully"
```

---

## 🚨 Common Mistakes & Solutions

### ❌ Problem: Getting 401 Unauthorized
**Cause:** Missing or invalid token
**Solution:** 
1. Make sure you added the `Authorization` header
2. Token format must be: `Bearer YOUR_TOKEN` (with space after "Bearer")
3. Token might be expired (login again to get new token)

---

### ❌ Problem: Getting 403 Forbidden
**Cause:** Your role doesn't have permission
**Solution:** 
- Use ADMIN token for user management operations
- DRIVER/CONTROLLER tokens can only update their own profile

---

### ❌ Problem: "Username already exists"
**Cause:** User already registered
**Solution:** Use /login instead of /register, or use different username

---

### ❌ Problem: Getting 400 Bad Request on POST/PUT
**Cause:** Invalid JSON or missing required fields
**Solution:** 
1. Make sure Body type is set to "raw" and "JSON"
2. Check all required fields are present
3. Verify JSON syntax (use quotes around strings)

---

## ✅ Verified Working Tokens

**ADMIN Token (valid until 2026-03-18):**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw
```

**DRIVER Token (valid until 2026-03-18):**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRFJJVkVSIiwic3ViIjoiZHJpdmVyIiwiaWF0IjoxNzczNzI0MDM5LCJleHAiOjE3NzM4MTA0Mzl9.mMqFL4h_GrB7MgfmsOjhvsptDJTFYUkUqXCntgYOHUA
```

---

## 📋 Quick Test Checklist

Use this ADMIN token to test all endpoints:

1. ✅ GET http://localhost:8080/api/users
   - Header: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw`

2. ✅ GET http://localhost:8080/api/users/1
   - Same header

3. ✅ POST http://localhost:8080/api/users
   - Same header + Content-Type: application/json
   - Body: `{"userName":"test","email":"test@vmas.com","password":"test123","role":"DRIVER"}`

4. ✅ PUT http://localhost:8080/api/users/1
   - Same header + Content-Type: application/json
   - Body: `{"userName":"admin","email":"admin@vmas.com","role":"ADMIN","accountStatus":"ACTIVE","profilePicture":"updated.jpg"}`

5. ✅ DELETE http://localhost:8080/api/users/4
   - Same header only

---

## 🎯 100% Confirmed Working

I just tested ALL endpoints via PowerShell and they ALL work perfectly:
- ✅ GET /api/users → Returns list of users
- ✅ GET /api/users/1 → Returns user details
- ✅ POST /api/users → Creates new user
- ✅ PUT /api/users/4 → Updates user
- ✅ DELETE /api/users/4 → Deletes user
- ✅ RBAC working → Driver gets 403 on /api/users

**The backend is 100% functional. The issue is Postman configuration!**

---

## 📸 Postman Screenshot Guide

### For GET Request:
1. Method: GET
2. URL: http://localhost:8080/api/users
3. **Headers tab:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
4. Click **Send**

### For POST/PUT Request:
1. Method: POST or PUT
2. URL: http://localhost:8080/api/users
3. **Headers tab:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body tab:**
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste JSON body
5. Click **Send**

---

## 💡 Pro Tip: Use Postman Environment Variables

### Setup Environment Variables (RECOMMENDED)

1. **Create a new Environment in Postman:**
   - Click the eye icon (👁️) in top right corner
   - Click "Add" next to "Environments"
   - Name it "VMAS Local"

2. **Add these variables:**
   - Variable: `adminToken`, Initial Value: (paste your admin token after login)
   - Variable: `driverToken`, Initial Value: (paste your driver token after login)
   - Variable: `controllerToken`, Initial Value: (paste your controller token after login)

3. **Select the environment:**
   - Use the dropdown in top right to select "VMAS Local"

4. **Update requests to use variables:**
   - Instead of: `Bearer YOUR_ADMIN_TOKEN_HERE`
   - Use: `Bearer {{adminToken}}`

**The updated Postman collection now uses these variables automatically!**

### Quick Setup Steps:
1. Login as admin using the Authentication folder
2. Copy the token from the response
3. Set `adminToken` environment variable to this value
4. All User Management requests will now work automatically!

This way you don't have to copy-paste the token every time!

---

## ✅ FINAL CHECK

If you're still having issues, try this EXACT request in Postman:

**Method:** GET  
**URL:** `http://localhost:8080/api/users`  
**Headers:**
- Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw`

This WILL work (tested and confirmed).

If it doesn't work, check:
1. Is the Spring Boot app still running on port 8080?
2. Did you add the Authorization header correctly?
3. Is there a space between "Bearer" and the token?
