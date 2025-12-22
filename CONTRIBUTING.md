# Contributing to EZ AI Pipeline

Thank you for your interest in contributing to EZ AI Pipeline! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/ezcorp-org/ez-ai-pipeline.git`
3. Install dependencies: `bun install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (latest stable version)
- An Anthropic API key for testing

### Running the Project

```bash
# Run the CLI
bun run src/index.ts --help

# Run tests
bun test

# Type check
bun run typecheck

# Format code
bun run format
```

## Code Style

- Use TypeScript with strict mode
- Use absolute imports with path aliases (e.g., `@core/`, `@utils/`)
- Follow existing code patterns and conventions
- Keep functions focused and small
- Add JSDoc comments for public APIs

### Import Order

1. External dependencies
2. Internal modules (using path aliases)
3. Types (using `import type`)

### Naming Conventions

- Files: kebab-case (e.g., `stage-runner.ts`)
- Classes: PascalCase (e.g., `PipelineExecutor`)
- Functions: camelCase (e.g., `validatePipeline`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT_MS`)

## Testing

- Write tests for new features
- Update tests when modifying existing functionality
- Aim for good coverage of critical paths
- Use descriptive test names

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add a clear description of changes
4. Reference any related issues

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for parallel stage execution
fix: resolve variable interpolation with nested paths
docs: update README with new configuration options
test: add tests for condition evaluator
```

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Bun version, etc.)

## Feature Requests

Feature requests are welcome! Please:

- Check if the feature already exists or is planned
- Describe the use case
- Explain how the feature should work

## Questions?

Feel free to open an issue for questions or discussions about the project.
