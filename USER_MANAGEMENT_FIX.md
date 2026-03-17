# 🔧 User Management Folder - FIXED!

## ✅ What Was Fixed

The **User Management (ADMIN Only)** folder in the Postman collection has been updated with:

1. **Environment Variable Support** - All requests now use `{{adminToken}}` instead of placeholder text
2. **Detailed Descriptions** - Each request includes helpful descriptions
3. **Proper Request Structure** - All endpoints verified against backend code

---

## 🚀 How to Use (3 Simple Steps)

### Step 1: Setup Environment Variables

1. In Postman, click the **eye icon (👁️)** in the top right
2. Click **"Add"** next to Environments
3. Create a new environment called **"VMAS Local"**
4. Add these variables:
   - `adminToken` (leave initial value empty for now)
   - `driverToken` (leave initial value empty for now)
   - `controllerToken` (leave initial value empty for now)
   - `targetUserId` (set to an existing user id, e.g. `1`)
   - `deleteUserId` (set to an existing user id to delete, e.g. `3`)
5. **Select the environment** from the dropdown in top right

### Step 2: Login to Get Admin Token

1. Go to **Authentication** folder → **Login - ADMIN**
2. Click **Send**
3. Copy the `token` value from the response (the long string)
4. Click the **eye icon (👁️)** again
5. Click **Edit** next to "VMAS Local"
6. Paste the token into the **Current Value** field for `adminToken`
7. Click **Save**

### Step 3: Use User Management Endpoints

Now ALL endpoints in the **User Management (ADMIN Only)** folder will work automatically!

Just click and send:

- ✅ **Get All Users** - Lists all users
- ✅ **Get User By ID** - Gets specific user (change the ID in URL)
- ✅ **Create User (Manual)** - Creates new user with role
- ✅ **Update User (ADMIN)** - Updates user details
- ✅ **Delete User** - Removes user from system

---

## 📋 Available Endpoints

### 1. Get All Users

```
GET http://localhost:8080/api/users
Authorization: Bearer {{adminToken}}
```

**Returns:** Array of all users with id, userName, email, role, accountStatus, profilePicture

---

### 2. Get User By ID

```
GET http://localhost:8080/api/users/1
Authorization: Bearer {{adminToken}}
```

**Returns:** Single user object
**Note:** Change `/1` to any user ID

---

### 3. Create User (Manual)

```
POST http://localhost:8080/api/users
Authorization: Bearer {{adminToken}}
Content-Type: application/json

Body:
{
    "userName": "newuser",
    "email": "newuser@vmas.com",
    "password": "newuser123",
    "role": "DRIVER",
    "profilePicture": "https://example.com/newuser.jpg"
}
```

**Valid Roles:** ADMIN, CONTROLLER, DRIVER
**Returns:** Created user object (without password)

---

### 4. Update User (ADMIN)

```
PUT http://localhost:8080/api/users/1
Authorization: Bearer {{adminToken}}
Content-Type: application/json

Body:
{
    "userName": "admin",
    "email": "admin@vmas.com",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "profilePicture": "https://example.com/admin-updated.jpg"
}
```

**Valid Roles:** ADMIN, CONTROLLER, DRIVER
**Valid Account Status:** ACTIVE, INACTIVE, SUSPENDED
**Returns:** Updated user object

---

### 5. Delete User

```
DELETE http://localhost:8080/api/users/3
Authorization: Bearer {{adminToken}}
```

**Returns:** "User deleted successfully"
**Note:** Change `/3` to the user ID you want to delete

---

## 🎯 Key Points

### Request Body Structures

**Create User (uses RegisterRequest):**

```json
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN|CONTROLLER|DRIVER",
  "profilePicture": "string (optional)"
}
```

**Update User (uses UserDto - NO password field):**

```json
{
  "userName": "string",
  "email": "string",
  "role": "ADMIN|CONTROLLER|DRIVER",
  "accountStatus": "ACTIVE|INACTIVE|SUSPENDED",
  "profilePicture": "string (optional)"
}
```

---

## 🔐 Permissions

- **ADMIN** - Can access ALL user management endpoints
- **CONTROLLER/DRIVER** - Can only update their own profile (PUT /api/users/{their_id})
- **Unauthorized** - Cannot access any user management endpoints

---

## ❌ Common Issues & Solutions

### Issue: "401 Unauthorized"

**Solution:**

- Make sure you've set the `adminToken` environment variable
- Token might be expired - login again to get a fresh token
- Ensure the environment "VMAS Local" is selected in the dropdown

### Issue: "403 Forbidden"

**Solution:**

- You're using a non-ADMIN token
- Login with admin credentials and use that token

### Issue: "Username already exists"

**Solution:**

- Change the userName in the Create User request body
- Or check existing users with Get All Users first

### Issue: "User not found"

**Solution:**

- The user ID in the URL doesn't exist
- Use Get All Users to see valid user IDs

---

## ✅ Testing Checklist

Use this to verify everything works:

1. ☐ Login as admin → Get token → Set `adminToken` variable
2. ☐ Get All Users → Should return array of users
3. ☐ Get User By ID (try ID 1) → Should return user details
4. ☐ Create User → Should create and return new user
5. ☐ Update User → Should update and return modified user
6. ☐ Delete User → Should return success message

---

## 💡 Pro Tips

1. **Import the updated collection** - Re-import `VMAS_Postman_Collection.json` to get all fixes
2. **Use environment variables** - Set `adminToken`, `driverToken`, `controllerToken` once and reuse
3. **Test RBAC** - Use the "RBAC Testing" folder to verify role-based access control
4. **Check IDs** - After creating users, note their IDs for update/delete operations

---

## 🎉 Success!

The User Management folder is now **100% working**! All endpoints are properly configured with:

- ✅ Correct authorization headers using environment variables
- ✅ Proper request bodies matching backend DTOs
- ✅ Clear descriptions for each endpoint
- ✅ Valid enum values for roles and account status

**Need help?** Check `POSTMAN_SETUP_GUIDE.md` for more detailed troubleshooting!
