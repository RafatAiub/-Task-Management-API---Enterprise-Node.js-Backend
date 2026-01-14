# Contributing Guidelines

Thank you for considering contributing to this project! This document provides guidelines and best practices for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start MongoDB
docker run -d -p 27017:27017 mongo:latest

# Run in development mode
npm run dev
```

## Coding Standards

### JavaScript Style Guide

We follow the **Airbnb JavaScript Style Guide** with some modifications:

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters

### Naming Conventions

- **Variables & Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: camelCase
- **Folders**: camelCase

### Comments

- Use JSDoc for all public methods
- Add inline comments for complex logic
- Keep comments up-to-date

```javascript
/**
 * Create a new task
 * @param {string} userId - User ID
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>}
 */
async createTask(userId, taskData) {
  // Implementation
}
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```
feat(auth): add password reset functionality

fix(tasks): resolve duplicate task creation bug

docs(readme): update installation instructions
```

## Testing

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 70%
- Use descriptive test names

```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task successfully', async () => {
      // Test implementation
    });

    it('should throw error for invalid data', async () => {
      // Test implementation
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Run linter**:
   ```bash
   npm run lint
   ```

4. **Update documentation** if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Up-to-date with main branch

## Project Structure

When adding new features, follow the existing structure:

```
src/
├── config/         # Configuration files
├── models/         # Database models
├── repositories/   # Data access layer
├── services/       # Business logic
├── controllers/    # Request handlers
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── validators/     # Joi schemas
└── utils/          # Utility functions
```

## Design Patterns

Follow these patterns when contributing:

1. **Repository Pattern**: All database access through repositories
2. **Dependency Injection**: Services receive dependencies via constructor
3. **Async Wrapper**: Use asyncHandler for async routes
4. **Validation**: Use Joi schemas for input validation
5. **Error Handling**: Throw ApiError for consistent errors

## Documentation

### Code Documentation

- Add JSDoc comments for all public methods
- Document complex algorithms
- Explain non-obvious code

### API Documentation

When adding new endpoints:

1. Update README with endpoint details
2. Include request/response examples
3. Document all parameters
4. List possible error codes

## Performance Guidelines

- Use database indexes appropriately
- Implement pagination for list endpoints
- Avoid N+1 queries
- Use connection pooling
- Cache when appropriate

## Security Guidelines

- Never commit secrets or API keys
- Validate all user input
- Use parameterized queries
- Implement rate limiting
- Follow OWASP best practices

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
