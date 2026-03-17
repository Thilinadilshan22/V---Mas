# 🔥 QUICK FIX: User Management Not Working

## 🎯 Problem
The user management functionality stopped working because:
1. ❌ Database might not be set up
2. ❌ No default users in the database
3. ❌ Postman environment variables not configured

## ✅ Quick Solution (5 Minutes)

### Step 1: Check MySQL is Running

Open Command Prompt and run:
```cmd
mysql --version
```

If you see a version number, MySQL is installed. If not, install MySQL first.

### Step 2: Create Database and Users

**Option A - Automatic (Recommended):**

1. Open MySQL Command Line (search in Windows Start menu)
2. Enter your MySQL password
3. Run this single command:
   ```sql
   source C:\Users\ASUS\Desktop\New folder\New folder (2)\ems-backend\setup-database.sql
   ```
4. Press Enter
5. Done! ✅

**Option B - Manual:**

1. Open MySQL Command Line
2. Copy and paste these commands one by one:

```sql
CREATE DATABASE IF NOT EXISTS vmas_db;
USE vmas_db;
```

Leave the MySQL window open for now.

### Step 3: Start the Application

1. Open Command Prompt
2. Navigate to project folder:
   ```cmd
   cd "C:\Users\ASUS\Desktop\New folder\New folder (2)\ems-backend"
   ```
3. Run the application:
   ```cmd
   mvnw.cmd spring-boot:run
   ```
4. Wait for "Started VmasBackendApplication" message

**The application will auto-create the database tables!**

### Step 4: Insert Default Users

1. Go back to MySQL Command Line
2. Run these commands:

```sql
USE vmas_db;

-- Admin user (username: admin, password: admin123)
INSERT IGNORE INTO users (user_name, email, password, role, account_status)
VALUES ('admin', 'admin@vmas.com', 
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
        'ADMIN', 'ACTIVE');

-- Controller user (username: controller1, password: controller123)
INSERT IGNORE INTO users (user_name, email, password, role, account_status)
VALUES ('controller1', 'controller@vmas.com', 
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
        'CONTROLLER', 'ACTIVE');

-- Driver user (username: driver1, password: driver123)
INSERT IGNORE INTO users (user_name, email, password, role, account_status)
VALUES ('driver1', 'driver@vmas.com', 
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
        'DRIVER', 'ACTIVE');

-- Check if users were created
SELECT id, user_name, email, role FROM users;
```

You should see 3 users listed!

### Step 5: Setup Postman Environment

1. **Import Environment File:**
   - Open Postman
   - Click "Import" button
   - Select file: `VMAS_Local_Environment.postman_environment.json`
   - Click Import
   - **Select** "VMAS Local" from the environment dropdown (top right)

2. **Get Admin Token:**
   - Open Postman collection: **VMAS Postman Collection**
   - Go to: **Authentication** → **Login - ADMIN**
   - Click **Send**
   - Copy the `token` value from response

3. **Set Token in Environment:**
   - Click the **eye icon (👁️)** in top right
   - Click **Edit** next to "VMAS Local"
   - Paste token into **Current Value** of `adminToken`
   - Click **Save**

### Step 6: Test User Management

In Postman:
1. Go to: **User Management (ADMIN Only)** → **Get All Users**
2. Click **Send**
3. You should see 3 users! 🎉

---

## 🔐 Default Users Created

| Username | Password | Role | Use For |
|----------|----------|------|---------|
| `admin` | `admin123` | ADMIN | User management, all operations |
| `controller1` | `controller123` | CONTROLLER | Vehicle tracking, assignments |
| `driver1` | `driver123` | DRIVER | Basic operations, own profile |

---

## 🆘 Still Not Working?

### Error: "Communications link failure"
**Fix:** MySQL is not running. Start it with:
```cmd
net start MySQL80
```
Or start "MySQL" from Windows Services.

### Error: "Access denied for user 'root'"
**Fix:** Update `application.properties` with your MySQL password:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Error: "Table 'users' doesn't exist"
**Fix:** The application didn't create tables. Check:
1. `spring.jpa.hibernate.ddl-auto=update` in application.properties
2. Restart the application

### Error: "401 Unauthorized" in Postman
**Fix:**
1. Make sure "VMAS Local" environment is selected
2. Get a fresh token by logging in again
3. Token expires after 24 hours

### Error: "Username already exists"
**Fix:** Users already exist in database! This is good. Just login with existing credentials.

---

## 📋 Quick Test Commands

To verify everything works, run these in MySQL:

```sql
-- Check database exists
SHOW DATABASES LIKE 'vmas_db';

-- Check tables exist
USE vmas_db;
SHOW TABLES;

-- Check users exist
SELECT id, user_name, email, role, account_status FROM users;

-- Count employees
SELECT COUNT(*) FROM employees;
```

---

## 🎯 Summary

**What you should have now:**
- ✅ MySQL running with `vmas_db` database
- ✅ Tables created automatically by Spring Boot
- ✅ 3 default users (admin, controller1, driver1)
- ✅ Application running on http://localhost:8080
- ✅ Postman environment configured with tokens
- ✅ User Management endpoints working

**What to do next:**
1. Test all endpoints in Postman
2. Read `POSTMAN_SETUP_GUIDE.md` for detailed API docs
3. Check `TESTING_GUIDE.md` for testing scenarios

---

## 💡 Pro Tips

1. **Save your tokens** - Tokens last 24 hours, save them in Postman environment
2. **Check MySQL first** - Most issues are because MySQL isn't running
3. **Watch the console** - Application logs show errors clearly
4. **Use INSERT IGNORE** - Prevents duplicate user errors when re-running SQL

---

## ✅ Environment Restored!

Your user management environment should now be working perfectly! 🚀

Need more help? Check `ENVIRONMENT_SETUP.md` for detailed setup guide.
