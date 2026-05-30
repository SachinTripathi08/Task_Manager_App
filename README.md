# Task Manager Web Application

A simple task management web application built as a college assignment. Users can register, login, and manage their personal tasks with different statuses (Todo, In Progress, Done).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Java 17, Spring Boot 3.2.5 |
| Security | Spring Security (Session-based) |
| Database | MySQL |
| Build Tool | Maven |

## Project Structure

```
ST0890/
├── frontend/                  # Static frontend files
│   ├── index.html             # Login page
│   ├── register.html          # Registration page
│   ├── dashboard.html         # Task dashboard
│   ├── css/
│   │   └── style.css          # Styles
│   └── js/
│       ├── api.js             # API helper (fetch wrapper)
│       ├── auth.js            # Login/Register logic
│       └── dashboard.js       # Task CRUD logic
│
├── backend/                   # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/taskmanager/
│       ├── TaskManagerApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── TaskController.java
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   └── TaskRequest.java
│       ├── model/
│       │   ├── User.java
│       │   └── Task.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── TaskRepository.java
│       └── service/
│           ├── UserService.java
│           └── TaskService.java
│
└── README.md
```

## Features

- User Registration and Login
- Create, Read, Update, Delete tasks
- Task status management (Todo → In Progress → Done)
- Each user can only see and manage their own tasks
- Responsive UI (works on mobile and desktop)
- Proper error handling and loading states

## Setup Instructions

### Prerequisites

- Java 17
- Maven 3.6+
- MySQL 8.0+
- Any web browser

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE task_manager_db;
```

The tables will be auto-created by Hibernate when the backend starts (`ddl-auto=update`).

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/task_manager_db
   spring.datasource.username=root
   spring.datasource.password=your_password_here
   ```

3. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8081`.

### 3. Frontend Setup

The frontend is a static site — no build step needed.

**Option A: Open directly**
- Open `frontend/index.html` in your browser.

**Option B: Use VS Code Live Server**
- Install the "Live Server" extension in VS Code.
- Right-click `frontend/index.html` → "Open with Live Server".
- It will open at `http://localhost:5500`.

> **Note:** The frontend is configured to call the backend at `http://localhost:8080/api`. If your backend runs on a different port, update the `API_BASE` variable in `frontend/js/api.js`.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/tasks` | Get all tasks for user | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/{id}` | Update a task | Yes |
| DELETE | `/api/tasks/{id}` | Delete a task | Yes |

## Assumptions

- Single-user access per session (no multi-device session sync).
- Task titles are required; descriptions are optional.
- No pagination — assumes a reasonable number of tasks per user.
- Password minimum length is 4 characters.
- Username must be unique.

## Technical Decisions

| Decision | Reason |
|----------|--------|
| Session-based auth instead of JWT | Simpler to implement with Spring Security defaults. Suitable for a traditional web app. |
| Separate frontend and backend | Allows independent deployment. Frontend can be hosted on Netlify for free. |
| No Lombok | Keep code explicit and readable. Easier to understand for beginners. |
| userId stored directly on Task (no JPA relationship) | Simpler than @ManyToOne mapping. Avoids lazy loading complexity. |
| Plain HTML/CSS/JS (no React/Angular) | Assignment requirement. Keeps things simple and avoids unnecessary complexity. |
| BCrypt for password hashing | Industry standard, built into Spring Security. |

## Tradeoffs

- **No JWT**: Sessions don't scale across multiple servers, but this is fine for a single-server assignment.
- **No input sanitization on frontend**: Relies on backend validation. For a production app, both sides should validate.
- **prompt() for task editing**: Simple but not the best UX. A modal would be nicer but adds complexity.
- **No pagination**: Fine for small datasets. Would need pagination for production use.
- **CORS configured for localhost only**: Needs to be updated for production deployment.

## Deployment

### Frontend (Netlify / Vercel)

1. Push the `frontend/` folder to a GitHub repository.
2. Connect to Netlify or Vercel.
3. Set the build directory to `frontend/` (no build command needed).
4. Update `API_BASE` in `frontend/js/api.js` to point to your deployed backend URL.

### Backend (Render — Optional)

1. Push the `backend/` folder to a GitHub repository.
2. Create a new Web Service on Render.
3. Set build command: `mvn clean install -DskipTests`
4. Set start command: `java -jar target/task-manager-0.0.1-SNAPSHOT.jar`
5. Add environment variables for MySQL connection (use a cloud MySQL like PlanetScale or Railway).
6. Update CORS origins in `SecurityConfig.java` to include your frontend URL.
