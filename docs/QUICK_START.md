# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd node_js_best_practise
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Mongoose (MongoDB ODM)
- JWT (authentication)
- Joi (validation)
- Winston (logging)
- And more...

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
```

**Important**: Change the JWT secrets to random, secure strings in production!

### 4. Start MongoDB

#### Option A: Using Docker (Recommended)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: Using Local Installation

Start MongoDB service:

**Windows**:
```bash
net start MongoDB
```

**macOS/Linux**:
```bash
sudo systemctl start mongod
```

### 5. Run the Application

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

The API will be available at: `http://localhost:3000`

### 6. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/api/v1/health
```

You should see:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-01-12T...",
  "environment": "development"
}
```

## Testing the API

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Create a Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "priority": "high",
    "dueDate": "2026-01-20"
  }'
```

### 4. Get All Tasks

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Code Quality

### Run ESLint

```bash
npm run lint
```

### Fix ESLint Issues

```bash
npm run lint:fix
```

## Docker Deployment

### Using Docker Compose (Easiest)

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t task-management-api .

# Run container
docker run -p 3000:3000 --env-file .env task-management-api
```

## Project Structure

```
node_js_best_practise/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware
│   ├── validators/      # Joi schemas
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Test files
├── docs/                # Documentation
├── logs/                # Application logs
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies
└── README.md            # Project overview
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**: 
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB port (default: 27017)

### Issue: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
- Change PORT in .env file
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Issue: JWT Token Errors

**Error**: `JsonWebTokenError: invalid token`

**Solution**:
- Ensure JWT_SECRET is set in .env
- Check token format in Authorization header
- Verify token hasn't expired

## Next Steps

1. **Read the Documentation**:
   - [Architecture Guide](docs/ARCHITECTURE.md)
   - [Contributing Guidelines](docs/CONTRIBUTING.md)

2. **Explore the Code**:
   - Start with `src/server.js`
   - Follow the data flow through layers
   - Review design patterns used

3. **Customize**:
   - Add new features
   - Modify existing endpoints
   - Implement your own business logic

4. **Deploy**:
   - Set up production environment
   - Configure environment variables
   - Deploy to cloud platform (AWS, Heroku, etc.)

## Learning Resources

### Design Patterns
- Repository Pattern
- Dependency Injection
- Middleware Pattern
- Async Wrapper Pattern

### Best Practices
- Clean Architecture
- SOLID Principles
- RESTful API Design
- Error Handling
- Security (JWT, bcrypt, rate limiting)

### Technologies
- Express.js Documentation
- Mongoose Documentation
- JWT Documentation
- Joi Validation

## Support

If you encounter any issues:

1. Check the [Common Issues](#common-issues--solutions) section
2. Review the documentation in `docs/`
3. Open an issue on GitHub

## License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

Remember: This project is designed to teach you professional Node.js development patterns. Take time to understand each layer and pattern before modifying the code.
