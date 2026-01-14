# 🚀 Task Management API - Enterprise Node.js Backend

A production-ready Node.js REST API built with **Clean Architecture** and industry best practices. This project demonstrates professional backend development patterns and is perfect for showcasing your skills.

## 📋 Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- ✅ **User Authentication & Authorization** (JWT-based)
- ✅ **Task Management** (CRUD operations with ownership)
- ✅ **Role-Based Access Control** (Admin & User roles)
- ✅ **Input Validation** (Joi schemas)
- ✅ **Error Handling** (Centralized error management)
- ✅ **Logging** (Winston logger with file rotation)
- ✅ **Security** (Helmet, CORS, Rate Limiting)
- ✅ **Database** (MongoDB with Mongoose ODM)
- ✅ **Testing** (Jest + Supertest)
- ✅ **Docker Support** (Containerization ready)

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Routes, Controllers, Middleware)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Business Logic Layer            │
│          (Services, DTOs)               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Access Layer               │
│    (Repositories, Models, Database)     │
└─────────────────────────────────────────┘
```

### Layer Responsibilities:

1. **Presentation Layer**: Handles HTTP requests/responses
2. **Business Logic Layer**: Contains core business rules
3. **Data Access Layer**: Manages database operations

## 🎨 Design Patterns

This project implements multiple enterprise design patterns:

| Pattern | Purpose | Location |
|---------|---------|----------|
| **Repository Pattern** | Abstract data access | `src/repositories/` |
| **Dependency Injection** | Loose coupling | Throughout services |
| **Factory Pattern** | Object creation | `src/factories/` |
| **Middleware Pattern** | Request processing | `src/middlewares/` |
| **Service Layer Pattern** | Business logic | `src/services/` |
| **Singleton Pattern** | Database connection | `src/config/database.js` |
| **Strategy Pattern** | Error handling | `src/utils/errorHandler.js` |

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting
- **Code Quality**: ESLint (Airbnb style guide)

## 📁 Project Structure

```
task-management-api/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection (Singleton)
│   │   ├── logger.js        # Winston logger setup
│   │   └── constants.js     # Application constants
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── User.js          # User model
│   │   └── Task.js          # Task model
│   │
│   ├── repositories/        # Data access layer (Repository Pattern)
│   │   ├── BaseRepository.js
│   │   ├── UserRepository.js
│   │   └── TaskRepository.js
│   │
│   ├── services/            # Business logic layer (Service Pattern)
│   │   ├── AuthService.js   # Authentication logic
│   │   ├── UserService.js   # User business logic
│   │   └── TaskService.js   # Task business logic
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── taskController.js
│   │
│   ├── routes/              # API routes
│   │   ├── index.js         # Route aggregator
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middlewares/         # Custom middleware
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access
│   │   ├── validationMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimitMiddleware.js
│   │
│   ├── validators/          # Joi validation schemas
│   │   ├── authValidator.js
│   │   ├── userValidator.js
│   │   └── taskValidator.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js      # Custom error class
│   │   ├── ApiResponse.js   # Standard response format
│   │   ├── asyncHandler.js  # Async wrapper
│   │   └── helpers.js       # Helper functions
│   │
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
│
├── logs/                    # Application logs
├── .env.example             # Environment variables template
├── .eslintrc.js             # ESLint configuration
├── .gitignore
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── jest.config.js           # Jest configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd task-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": "high",
  "dueDate": "2026-01-20"
}
```

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🐳 Docker Deployment

### Build and run with Docker Compose

```bash
# Build and start containers
npm run docker:run

# Stop containers
docker-compose down
```

### Manual Docker commands

```bash
# Build image
docker build -t task-management-api .

# Run container
docker run -p 3000:3000 --env-file .env task-management-api
```

## 📝 Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## 🔒 Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents brute-force attacks
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Joi schemas for all inputs

## 🎓 Learning Objectives

This project teaches you:

1. ✅ **Clean Architecture** - Separation of concerns
2. ✅ **SOLID Principles** - Writing maintainable code
3. ✅ **Design Patterns** - Industry-standard solutions
4. ✅ **Security Best Practices** - Protecting your API
5. ✅ **Testing** - Writing reliable code
6. ✅ **Documentation** - Professional standards
7. ✅ **Git Workflow** - Version control best practices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

⭐ **Star this repository if you found it helpful!**
