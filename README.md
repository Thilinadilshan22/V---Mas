# VMAS – Vehicle Management & Authentication System

A full-stack web application for managing vehicle fleets with role-based access control. Built with **Spring Boot 3** on the backend and **React 19 + TypeScript** on the frontend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend (Spring Boot)](#2-backend-spring-boot)
  - [3. Frontend (React + Vite)](#3-frontend-react--vite)
- [Configuration](#configuration)
- [User Roles](#user-roles)
- [Default Credentials](#default-credentials)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [License](#license)

---

## Features

- **JWT Authentication** – Secure, stateless login/logout with 24-hour token expiration
- **Role-Based Access Control** – ADMIN, CONTROLLER, and DRIVER roles with distinct permissions
- **Vehicle Management** – Register, update, and track vehicles in the fleet
- **Fuel Logging** – Drivers log fuel fill-ups; analytics show costs and consumption trends
- **Service Records** – Schedule and track vehicle maintenance with upcoming service alerts
- **Analytics & Reports** – Monthly fuel summaries, chart data, and per-vehicle statistics
- **Employee & User Management** – Admin panel to manage users and employees

---

## Tech Stack

### Backend
| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.5.6 |
| Spring Security + JWT (JJWT) | 0.11.5 |
| Spring Data JPA / Hibernate | – |
| MySQL | 8.x |
| Lombok | – |
| Maven | 3.6+ |

### Frontend
| Technology | Version |
|---|---|
| React | 19.2.4 |
| TypeScript | 5.9.3 |
| Vite | 8.0.1 |
| React Router DOM | 7.13.1 |
| Axios | 1.13.6 |

---

## Architecture Overview

```
┌─────────────────────┐          ┌──────────────────────────┐
│  React + TypeScript │  HTTP/   │  Spring Boot REST API    │
│  (port 3000)        │◄────────►│  (port 8080)             │
│                     │  JSON    │                          │
│  • AuthContext      │          │  • JWT Security Filter   │
│  • React Router     │          │  • Controllers           │
│  • Axios            │          │  • Services / Repos      │
└─────────────────────┘          │  • JPA Entities          │
                                 └──────────┬───────────────┘
                                            │ JDBC
                                 ┌──────────▼───────────────┐
                                 │  MySQL Database          │
                                 │  (vmas_db)               │
                                 └──────────────────────────┘
```

---

## Prerequisites

- **Java 17+**
- **Maven 3.6+** (or use the included `mvnw` wrapper)
- **Node.js 18+** and **npm**
- **MySQL 8.x** running locally

---

## Getting Started

### 1. Database Setup

Create the database and seed initial data:

```bash
mysql -u root -p < setup-database.sql
```

Optional schema migrations (apply if upgrading an existing installation):

```bash
mysql -u root -p < service-migration.sql
mysql -u root -p < fix-database-column.sql
mysql -u root -p < fix-fuel-table.sql
```

### 2. Backend (Spring Boot)

Update `src/main/resources/application.properties` with your MySQL credentials (see [Configuration](#configuration)), then run:

```bash
# Using the Maven wrapper (Linux / macOS)
./mvnw spring-boot:run

# Using the Maven wrapper (Windows)
mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

To build an executable JAR:

```bash
./mvnw clean package
java -jar target/*.jar
```

### 3. Frontend (React + Vite)

```bash
cd ems-frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`. The Vite dev server automatically proxies `/api` requests to the backend at `http://localhost:8080`.

To build for production:

```bash
npm run build       # output written to ems-frontend/dist/
npm run preview     # locally preview the production build
```

---

## Configuration

### Backend – `src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/vmas_db
spring.datasource.username=root
spring.datasource.password=

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=<your-256-bit-hex-secret>
jwt.expiration=86400000   # 24 hours in milliseconds
```

### Frontend

The Vite dev server proxies `/api` to `http://localhost:8080` by default. To point to a different backend, update the `proxy` section in `ems-frontend/vite.config.js`.

---

## User Roles

| Role | Permissions |
|---|---|
| **ADMIN** | Full access – manage users, vehicles, service records, fuel logs, employees |
| **CONTROLLER** | Manage vehicles and service records; view fuel analytics |
| **DRIVER** | Add and view their own fuel logs only |

---

## Default Credentials

These credentials are created by `setup-database.sql`:

| Role | Username | Password |
|---|---|---|
| ADMIN | `admin` | `admin123` |
| CONTROLLER | `controller1` | `controller123` |
| DRIVER | `driver1` | `driver123` |

> **Change these passwords before deploying to a production environment.**

---

## API Endpoints

All endpoints (except `/api/auth/**`) require a `Bearer <token>` Authorization header.

### Authentication – `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/auth/logout` | Logout |

### Vehicles – `/api/vehicles`
| Method | Path | Description |
|---|---|---|
| GET | `/api/vehicles` | List all vehicles |
| POST | `/api/vehicles` | Create a vehicle |
| GET | `/api/vehicles/{id}` | Get vehicle by ID |
| PUT | `/api/vehicles/{id}` | Update vehicle |
| DELETE | `/api/vehicles/{id}` | Delete vehicle |

### Fuel Logs – `/api/fuel`
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/fuel/add` | DRIVER | Add a fuel log |
| GET | `/api/fuel/my-logs` | DRIVER | Get own fuel logs |
| GET | `/api/fuel/my-logs/{id}` | DRIVER | Get specific fuel log |
| PUT | `/api/fuel/my-logs/{id}` | DRIVER | Update fuel log |
| GET | `/api/fuel/summary` | All | Monthly fuel summary |
| GET | `/api/fuel/chart` | All | Monthly chart data |
| GET | `/api/fuel/stats` | All | Vehicle fuel statistics |
| GET | `/api/fuel/log/{id}` | ADMIN | Get any fuel log by ID |
| GET | `/api/fuel/vehicle/{regNo}` | All | All logs for a vehicle |

### Service Records – `/api/services`
| Method | Path | Description |
|---|---|---|
| POST | `/api/services` | Create service record |
| GET | `/api/services` | List all service records |
| GET | `/api/services/{id}` | Get service record |
| PUT | `/api/services/{id}` | Update service record |
| DELETE | `/api/services/{id}` | Delete service record |
| POST | `/api/services/filter` | Filter service records |
| GET | `/api/services/vehicle/{vehicleId}` | Get services for a vehicle |
| GET | `/api/services/stats` | Service statistics |
| GET | `/api/services/upcoming` | Upcoming services (next 30 days) |
| GET | `/api/services/recent` | Last 5 service records |

### Users – `/api/users`
CRUD operations for user management (ADMIN only).

### Employees – `/api/employees`
CRUD operations for employee management.

A full Postman collection is included: `VMAS_Postman_Collection.json`.
Import it along with `VMAS_Local_Environment.postman_environment.json` to test all endpoints.

---

## Project Structure

```
V---Mas/
├── src/main/java/net/javaguids/ems_backend/
│   ├── controller/          # REST controllers
│   ├── service/impl/        # Business logic
│   ├── repository/          # Spring Data JPA repositories
│   ├── entity/              # JPA entities (User, Vehicle, FuelLog, …)
│   ├── dto/                 # Request / response DTOs
│   ├── security/            # JWT filter, utilities
│   ├── config/              # SecurityConfig, CORS
│   ├── enums/               # Role, AccountStatus, ServiceType
│   ├── exception/           # Global exception handling
│   └── EmsBackendApplication.java
├── src/main/resources/
│   └── application.properties
├── ems-frontend/
│   ├── src/
│   │   ├── pages/           # 17 page components
│   │   ├── components/      # Navbar, Sidebar, PrivateRoute, …
│   │   ├── context/         # AuthContext
│   │   ├── services/        # API service layer
│   │   └── api/             # Axios instance
│   ├── package.json
│   └── vite.config.js
├── setup-database.sql
├── service-migration.sql
├── VMAS_Postman_Collection.json
├── pom.xml
└── README.md
```

---

## Testing

### Postman

Import the included collections into Postman:

- `VMAS_Postman_Collection.json` – full API test suite
- `Fuel_Analysis_Complete_Postman_Collection.json` – fuel analysis endpoints
- `VMAS_Local_Environment.postman_environment.json` – pre-configured environment variables

### PowerShell (Fuel API)

```powershell
.\test-fuel-api-complete.ps1
```

### Frontend Linting

```bash
cd ems-frontend
npm run lint
```

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Capstone-group-13
