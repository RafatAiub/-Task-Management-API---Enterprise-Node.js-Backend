# Architecture Documentation

## Overview

This project follows **Clean Architecture** principles with clear separation of concerns across multiple layers. The architecture is designed to be:

- **Maintainable**: Easy to understand and modify
- **Testable**: Each layer can be tested independently
- **Scalable**: Can grow without becoming unmanageable
- **Flexible**: Easy to swap implementations

## Architecture Layers

### 1. Presentation Layer (Routes & Controllers)

**Location**: `src/routes/`, `src/controllers/`

**Responsibility**: Handle HTTP requests and responses

**Key Components**:
- **Routes**: Define API endpoints and attach middleware
- **Controllers**: Process requests, call services, return responses
- **Middleware**: Cross-cutting concerns (auth, validation, error handling)

**Pattern**: Thin controllers - minimal logic, delegate to services

```javascript
// Example: Controller delegates to service
const createTask = asyncHandler(async (req, res) => {
  const result = await taskService.createTask(req.user.userId, req.body);
  res.status(201).json(ApiResponse.created(result.task, result.message));
});
```

### 2. Business Logic Layer (Services)

**Location**: `src/services/`

**Responsibility**: Implement core business rules and logic

**Key Components**:
- **Services**: Contain all business logic
- **DTOs**: Data transfer objects (implicit in request/response)

**Pattern**: Fat services - all business logic lives here

**Dependency Injection**: Services receive repositories via constructor

```javascript
class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }
  
  async createTask(userId, taskData) {
    // Business logic here
  }
}
```

### 3. Data Access Layer (Repositories & Models)

**Location**: `src/repositories/`, `src/models/`

**Responsibility**: Manage database operations

**Key Components**:
- **Models**: Define database schemas (Mongoose)
- **Repositories**: Abstract data access logic

**Pattern**: Repository Pattern - isolate data access

```javascript
class TaskRepository extends BaseRepository {
  async findByUser(userId, options = {}) {
    return await this.find({ user: userId }, options);
  }
}
```

## Design Patterns Used

### 1. Repository Pattern

**Purpose**: Abstract data access logic from business logic

**Implementation**:
- `BaseRepository`: Common CRUD operations
- Specific repositories extend base and add custom methods

**Benefits**:
- Easy to test (mock repositories)
- Easy to switch databases
- Centralized data access

### 2. Dependency Injection

**Purpose**: Loose coupling between components

**Implementation**:
```javascript
// Services receive dependencies via constructor
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
```

**Benefits**:
- Testable (inject mocks)
- Flexible (swap implementations)
- Clear dependencies

### 3. Middleware Pattern

**Purpose**: Process requests in a pipeline

**Implementation**:
```javascript
router.post('/', 
  authenticate,           // Auth middleware
  validateBody(schema),   // Validation middleware
  controller.create       // Controller
);
```

**Benefits**:
- Reusable logic
- Clean separation of concerns
- Easy to add/remove features

### 4. Async Wrapper Pattern

**Purpose**: Eliminate try-catch blocks in controllers

**Implementation**:
```javascript
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

**Benefits**:
- Cleaner code
- Consistent error handling
- Less boilerplate

### 5. Factory Pattern

**Purpose**: Create objects with complex initialization

**Implementation**: Used in middleware and service creation

### 6. Singleton Pattern

**Purpose**: Ensure single instance

**Implementation**: Database connection class

```javascript
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
  }
}
```

## Data Flow

```
Request → Middleware → Controller → Service → Repository → Database
                                                              ↓
Response ← Controller ← Service ← Repository ← Database Result
```

### Example Flow: Create Task

1. **Request**: POST /api/v1/tasks
2. **Middleware**: 
   - Rate limiting
   - Authentication (verify JWT)
   - Validation (Joi schema)
3. **Controller**: 
   - Extract data from request
   - Call service method
4. **Service**: 
   - Apply business rules
   - Call repository
5. **Repository**: 
   - Execute database query
6. **Response**: 
   - Format with ApiResponse
   - Send to client

## Error Handling Strategy

### Centralized Error Handling

All errors flow through `errorMiddleware.js`:

```javascript
app.use(errorHandler); // Last middleware
```

### Custom Error Class

```javascript
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
```

### Error Flow

1. Error thrown anywhere in application
2. Caught by async wrapper or Express
3. Passed to error middleware
4. Converted to consistent format
5. Logged and returned to client

## Security Layers

1. **Helmet**: Security headers
2. **CORS**: Cross-origin protection
3. **Rate Limiting**: Prevent abuse
4. **JWT**: Stateless authentication
5. **Bcrypt**: Password hashing
6. **Joi**: Input validation
7. **Mongoose**: Query sanitization

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock dependencies
- Fast execution

### Integration Tests
- Test API endpoints
- Use test database
- Verify full flow

### Example:
```javascript
describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(201);
  });
});
```

## Scalability Considerations

### Horizontal Scaling
- Stateless design (JWT tokens)
- No session storage
- Database connection pooling

### Vertical Scaling
- Async/await for non-blocking I/O
- Efficient database queries
- Proper indexing

### Future Enhancements
- Redis for caching
- Message queues (RabbitMQ/Kafka)
- Microservices architecture
- GraphQL API

## Code Organization Principles

### SOLID Principles

1. **Single Responsibility**: Each class has one job
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Derived classes can replace base classes
4. **Interface Segregation**: Many specific interfaces over one general
5. **Dependency Inversion**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- BaseRepository for common operations
- Reusable middleware
- Utility functions

### KISS (Keep It Simple, Stupid)
- Clear naming conventions
- Simple, focused functions
- Minimal complexity

## Naming Conventions

- **Files**: camelCase (userController.js)
- **Classes**: PascalCase (UserService)
- **Functions**: camelCase (getUserProfile)
- **Constants**: UPPER_SNAKE_CASE (HTTP_STATUS)
- **Routes**: kebab-case (/api/v1/user-profile)

## Documentation Standards

- JSDoc comments for all public methods
- README for project overview
- Architecture docs for design decisions
- API docs for endpoints
