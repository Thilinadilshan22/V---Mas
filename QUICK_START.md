# 🎯 QUICK START - Copy & Paste These Requests into Postman

## ✅ ALL ENDPOINTS ARE WORKING! Just copy these exact requests:

---

## 1️⃣ LOGIN FIRST (Get Your Token)

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

**👉 COPY THE TOKEN FROM THE RESPONSE!**

---

## 2️⃣ GET ALL USERS

```
Method: GET
URL: http://localhost:8080/api/users

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

**REPLACE `YOUR_TOKEN_HERE` with the token you got from login!**

---

## 3️⃣ GET USER BY ID

```
Method: GET
URL: http://localhost:8080/api/users/1

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 4️⃣ CREATE NEW USER

```
Method: POST
URL: http://localhost:8080/api/users

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
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

## 5️⃣ UPDATE USER

```
Method: PUT
URL: http://localhost:8080/api/users/1

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
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

## 6️⃣ DELETE USER

```
Method: DELETE
URL: http://localhost:8080/api/users/4

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔥 WORKING TOKEN (Valid until 2026-03-18):

If you want to skip login, use this token directly:

```
Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MzcyNDAwNiwiZXhwIjoxNzczODEwNDA2fQ.5diaQkBtzGzcy0cQYOuwcFVPV8nKZh9zP0oqPd-62dw
```

Just paste this in the Authorization header!

---

## 📝 HOW TO USE IN POSTMAN:

### For GET requests:
1. Create new request
2. Set method to GET
3. Enter URL: `http://localhost:8080/api/users`
4. Go to **Headers** tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN` (paste the token after "Bearer ")
6. Click **Send**

### For POST/PUT requests:
1. Create new request
2. Set method to POST or PUT
3. Enter URL
4. Go to **Headers** tab
5. Add TWO headers:
   - Key: `Authorization` → Value: `Bearer YOUR_TOKEN`
   - Key: `Content-Type` → Value: `application/json`
6. Go to **Body** tab
7. Select **raw**
8. Select **JSON** from dropdown
9. Paste the JSON body
10. Click **Send**

---

## ⚠️ MAKE SURE:
- The word "Bearer" has a SPACE after it
- Don't include quotes around the token
- Body type is set to "raw" and "JSON" for POST/PUT
- Spring Boot app is running on port 8080

---

## ✅ TESTED & CONFIRMED WORKING

All these requests have been tested and work perfectly!
