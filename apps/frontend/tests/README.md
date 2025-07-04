# Frontend Testing Documentation

This directory contains comprehensive tests for the frontend application. The testing infrastructure is designed to be reusable, maintainable, and well-documented to support future development.

## 📁 Directory Structure

```
tests/
├── README.md                 # This documentation file
├── setup.ts                  # Global test configuration
├── factories/                # Test data factories
│   └── eventFactory.ts      # Event data generation utilities
├── mocks/                   # Mock implementations
│   └── graphqlMocks.ts     # GraphQL query mocking
├── utils/                   # Test utilities (planned)
│   └── testUtils.ts        # Reusable test helpers
├── about.test.tsx          # About page tests
├── event.test.tsx          # Event detail page tests
├── execute.test.ts         # GraphQL execution tests
└── homePage.test.tsx       # Home page tests
```

## 🧪 Test Patterns & Best Practices

### 1. Test Organization

Each test file follows a consistent structure:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

describe('Component Name', () => {
  beforeEach(() => {
    // Setup mocks and reset state
    vi.clearAllMocks();
    resetMockQueryResponses();
  });

  it('should render successfully', async () => {
    // Test implementation
  });

  it('should handle loading states', () => {
    // Test loading scenarios
  });

  it('should handle error states', async () => {
    // Test error scenarios
  });
});
```

### 2. Mock Data Management

Use the factory pattern for creating test data:

```typescript
import { buildEvent, buildEventList } from './factories/eventFactory';

// Create a single event
const event = buildEvent({ status: 'cancelled' });

// Create multiple events
const events = buildEventList(5, { registrationRequired: true });

// Create events with specific characteristics
const futureEvents = buildFutureEvents(3, 7); // 3 events 7 days from now
const fullEvents = buildFullEvents(2); // 2 events with no available spots
```

### 3. GraphQL Mocking

Use the enhanced GraphQL mocks for consistent API testing:

```typescript
import { 
  setMockQueryResponse, 
  setLoadingState, 
  setErrorState,
  setSuccessState,
  setEmptyState 
} from './mocks/graphqlMocks';

// Set up different response states
setLoadingState('events');
setErrorState('events', 'Failed to fetch events');
setSuccessState('events', { events: mockEvents });
setEmptyState('events');
```

### 4. Component Testing Patterns

#### Provider Wrapping
Always wrap components with necessary providers:

```typescript
import { renderWithProviders } from './utils/testUtils';

const { container } = renderWithProviders(<Component />, {
  queryClient: createMockQueryClient(),
  router: createMockRouter(),
});
```

#### Async Testing
Use `waitFor` for asynchronous operations:

```typescript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
}, { timeout: 5000 });
```

#### Error Boundary Testing
Test error scenarios comprehensively:

```typescript
it('should display error message when API fails', async () => {
  setErrorState('events', 'Network error');
  
  renderWithProviders(<Component />);
  
  expect(await screen.findByText('Error Loading Events')).toBeInTheDocument();
  expect(screen.getByText('Network error')).toBeInTheDocument();
});
```

## 🔧 Test Utilities

### Event Factory

The `eventFactory.ts` provides comprehensive event data generation:

- **`buildEvent(overrides)`**: Creates a single event with realistic data
- **`buildEventList(count, overrides)`**: Creates multiple events
- **`buildEventsWithStatus(status, count)`**: Creates events with specific status
- **`buildRegistrationRequiredEvents(count)`**: Creates events requiring registration
- **`buildFullEvents(count)`**: Creates events with no available spots
- **`buildTodayEvents(count)`**: Creates events happening today
- **`buildFutureEvents(count, daysFromNow)`**: Creates future events
- **`buildPastEvents(count, daysAgo)`**: Creates past events

### GraphQL Mocks

The `graphqlMocks.ts` provides flexible API mocking:

- **`setMockQueryResponse(key, response)`**: Set custom response for query
- **`resetMockQueryResponses()`**: Reset to default responses
- **`setLoadingState(key)`**: Set loading state
- **`setErrorState(key, message)`**: Set error state
- **`setSuccessState(key, data)`**: Set success state with data
- **`setEmptyState(key)`**: Set empty data state
- **`setMockEvents(key, count, overrides)`**: Set mock events

## 📋 Test Categories

### 1. Unit Tests
- Component rendering
- Props handling
- State management
- Event handlers

### 2. Integration Tests
- GraphQL query integration
- Router navigation
- Provider interactions
- Error boundary behavior

### 3. User Experience Tests
- Loading states
- Error states
- Empty states
- Accessibility features

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Test Coverage

Aim for comprehensive coverage across:

- **Component Logic**: 90%+ coverage
- **User Interactions**: All critical user flows
- **Error Scenarios**: All error boundaries and fallbacks
- **Edge Cases**: Empty states, loading states, network errors

## 🔄 Continuous Integration

Tests are automatically run in CI/CD pipelines:

1. **Pre-commit**: Run tests before committing
2. **Pull Requests**: Full test suite execution
3. **Deployment**: Coverage and integration tests

## 🛠️ Adding New Tests

### 1. Component Tests
```typescript
// ComponentName.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from './utils/testUtils';
import { ComponentName } from '../src/components/ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render correctly', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. Page Tests
```typescript
// PageName.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from './utils/testUtils';
import { setMockQueryResponse } from './mocks/graphqlMocks';

describe('PageName', () => {
  beforeEach(() => {
    setMockQueryResponse('queryKey', { data: mockData, isLoading: false, error: null });
  });

  it('should display page content', async () => {
    renderWithProviders(<PageName />);
    expect(await screen.findByText('Page Title')).toBeInTheDocument();
  });
});
```

### 3. Utility Tests
```typescript
// utilityName.test.ts
import { describe, it, expect } from 'vitest';
import { utilityFunction } from '../src/utils/utilityName';

describe('utilityFunction', () => {
  it('should handle normal input', () => {
    expect(utilityFunction('input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(utilityFunction('')).toBe('default output');
  });
});
```

## 🐛 Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` for async state changes
2. **Mock Resets**: Always reset mocks in `beforeEach`
3. **Provider Setup**: Ensure all required providers are included
4. **Query Keys**: Use consistent query keys across tests

### Debugging Tools

```typescript
// Enable debug logging
console.log('Debug info:', screen.debug());

// Check for specific elements
screen.getByTestId('test-id');

// Wait for specific conditions
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
```

## 📈 Performance Testing

For performance-critical components:

```typescript
it('should render within performance budget', () => {
  const start = performance.now();
  renderWithProviders(<HeavyComponent />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms budget
});
```

## 🔒 Security Testing

Test security-related features:

```typescript
it('should not expose sensitive data', () => {
  renderWithProviders(<Component />);
  
  // Ensure sensitive data is not rendered
  expect(screen.queryByText('password')).not.toBeInTheDocument();
  expect(screen.queryByText('token')).not.toBeInTheDocument();
});
```

## 📝 Documentation Standards

- **Test Descriptions**: Use clear, descriptive test names
- **Comments**: Document complex test logic
- **Examples**: Include usage examples in factory functions
- **Setup**: Document test setup requirements

## 🤝 Contributing

When adding new tests:

1. Follow existing patterns and conventions
2. Use the provided utilities and factories
3. Add comprehensive documentation
4. Ensure tests are deterministic and reliable
5. Update this documentation as needed

---

This testing infrastructure provides a solid foundation for maintaining code quality and supporting future development. The reusable utilities and well-documented patterns ensure consistency across the test suite. 