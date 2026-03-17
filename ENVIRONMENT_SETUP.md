# 🚀 VMAS Environment Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **MySQL Server** installed and running (version 8.0 or higher)
- ✅ **Java 17** installed
- ✅ **Maven** (or use included mvnw wrapper)
- ✅ **Postman** for API testing

---

## 🗄️ Step 1: Database Setup

### Option A: Using MySQL Command Line

1. **Open MySQL Command Line**:
   ```bash
   mysql -u root -p
   ```

2. **Run the setup script**:
   ```sql
   source setup-database.sql
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Go to **File** → **Run SQL Script**
4. Select `setup-database.sql`
5. Click **Run**

### Option C: Manual Setup

1. **Open MySQL and create database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS vmas_db;
   USE vmas_db;
   ```

2. **Start the Spring Boot application** (it will auto-create tables)

3. **Insert default users**:
   ```sql
   -- Admin user (username: admin, password: admin123)
   INSERT INTO users (user_name, email, password, role, account_status)
   VALUES ('admin', 'admin@vmas.com', 
           '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
           'ADMIN', 'ACTIVE');

   -- Controller user (username: controller1, password: controller123)
   INSERT INTO users (user_name, email, password, role, account_status)
   VALUES ('controller1', 'controller@vmas.com', 
           '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
           'CONTROLLER', 'ACTIVE');

   -- Driver user (username: driver1, password: driver123)
   INSERT INTO users (user_name, email, password, role, account_status)
   VALUES ('driver1', 'driver@vmas.com', 
           '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 
           'DRIVER', 'ACTIVE');
   ```

---

## ⚙️ Step 2: Configure Application Properties

The `application.properties` file is already configured. Verify these settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/vmas_db
spring.datasource.username=root
spring.datasource.password=

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000
```

**⚠️ IMPORTANT**: If your MySQL root password is not empty, update line 6:
```properties
spring.datasource.password=your_mysql_password
```

---

## 🏃 Step 3: Run the Application

### Using Maven Wrapper (Recommended)

**Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

### Using Installed Maven

```bash
mvn spring-boot:run
```

### Expected Output

You should see:
```
Started VmasBackendApplication in X.XXX seconds
```

The application runs on: **http://localhost:8080**

---

## 📮 Step 4: Setup Postman Environment

### Import the Collection

1. Open Postman
2. Click **Import**
3. Select `VMAS_Postman_Collection.json`
4. Click **Import**

### Create Environment

1. Click the **eye icon (👁️)** in top right corner
2. Click **Add** next to "Environments"
3. Name it: **VMAS Local**
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:8080` | `http://localhost:8080` |
| `adminToken` | *(leave empty)* | *(leave empty)* |
| `controllerToken` | *(leave empty)* | *(leave empty)* |
| `driverToken` | *(leave empty)* | *(leave empty)* |
| `targetUserId` | `1` | `1` |
| `deleteUserId` | `3` | `3` |

5. Click **Save**
6. **Select the environment** from the dropdown in top right

---

## 🔐 Step 5: Test Authentication

### Login as Admin

1. In Postman, go to: **Authentication** → **Login - ADMIN**
2. Click **Send**
3. Copy the `token` from response
4. Click **eye icon (👁️)** → **Edit** VMAS Local environment
5. Paste token into **Current Value** of `adminToken`
6. Click **Save**

### Login as Controller

1. Go to: **Authentication** → **Login - CONTROLLER**
2. Click **Send**
3. Copy token and save to `controllerToken` environment variable

### Login as Driver

1. Go to: **Authentication** → **Login - DRIVER**
2. Click **Send**
3. Copy token and save to `driverToken` environment variable

---

## ✅ Step 6: Verify Everything Works

### Test User Management (Admin Only)

1. Select **User Management (ADMIN Only)** folder
2. Click **Get All Users** → Send
3. Should return array of 3 users (admin, controller1, driver1)

### Test Employee Management

1. Select **Employee Management** folder
2. Click **Create Employee** → Send
3. Click **Get All Employees** → Send
4. Should see the created employee

### Test RBAC (Role-Based Access Control)

1. Go to **RBAC Testing** folder
2. Try accessing admin endpoints with driver token (should fail)
3. Try accessing own profile with driver token (should work)

---

## 🎯 Default User Credentials

| Username | Password | Role | Email |
|----------|----------|------|-------|
| `admin` | `admin123` | ADMIN | admin@vmas.com |
| `controller1` | `controller123` | CONTROLLER | controller@vmas.com |
| `driver1` | `driver123` | DRIVER | driver@vmas.com |

---

## ❌ Troubleshooting

### Issue: "Communications link failure"

**Solution:** Make sure MySQL server is running
```bash
# Windows - Check MySQL service
net start MySQL80

# Linux
sudo systemctl status mysql
```

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:** Update MySQL password in `application.properties`

### Issue: "Table 'vmas_db.users' doesn't exist"

**Solution:** 
1. Make sure `spring.jpa.hibernate.ddl-auto=update` in application.properties
2. Restart the application - it will auto-create tables

### Issue: "401 Unauthorized" in Postman

**Solution:**
1. Login again to get fresh token
2. Make sure environment is selected in Postman
3. Token expires after 24 hours

### Issue: Port 8080 already in use

**Solution:** 
1. Stop other applications using port 8080
2. OR change port in application.properties:
   ```properties
   server.port=8081
   ```

---

## 📚 Next Steps

1. ✅ Read `QUICK_START.md` for API overview
2. ✅ Check `POSTMAN_SETUP_GUIDE.md` for detailed API testing
3. ✅ Review `TESTING_GUIDE.md` for comprehensive testing scenarios
4. ✅ See `USER_MANAGEMENT_FIX.md` for user management details

---

## 🎉 You're All Set!

Your VMAS backend environment is ready! Start testing the APIs using Postman.

**Need help?** Check the other documentation files in this repository.
