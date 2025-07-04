# Testing Guidelines

This document provides comprehensive guidelines for testing the Welbi application.

## Table of Contents
- [Unit Tests](#unit-tests)
- [End-to-End Tests](#end-to-end-tests)
- [Test Utilities](#test-utilities)
- [Test Configuration](#test-configuration)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)
- [Debugging Tests](#debugging-tests)

## Unit Tests

### Overview
- All unit tests are stored in `apps/frontend/tests/unit`
- Follow the format `route.test.tsx` with one test file per route
- Tests use Vitest as the test runner with React Testing Library
- Coverage reports are generated automatically

### Test Structure
```
apps/frontend/tests/unit/
├── index.test.tsx          # Home page tests
├── about.test.tsx          # About page tests
├── event.test.tsx          # Event detail page tests
└── execute.test.ts         # GraphQL execution tests
```

### Running Unit Tests
```bash
# Run all unit tests
rushx test

# Run tests in watch mode
rushx test:watch

# Run tests with coverage
rushx test:coverage

```

### Test Harness
- **Setup**: `apps/frontend/tests/setup.ts`
  - Configures Jest DOM matchers
  - Sets up GraphQL mocks
  - Imports global test utilities

- **Test Utils**: `apps/frontend/tests/utils/testUtils.tsx`
  - `customRender()`: Renders components in a test-friendly environment
  - `setupTestEnv()`: Sets up environment before tests
  - Mocks dependencies like `@tanstack/react-router`, `@tanstack/router-devtools`
  - Provides QueryClient for React Query testing

### Test Configuration
- **Vitest Config**: `apps/frontend/vitest.config.ts`
  - Uses jsdom environment
  - Includes coverage reporting
  - Excludes config files and test directories from coverage

- **Test Config**: `apps/frontend/tests/testConfig.ts`
  - Contains test constants and utilities
  - Provides test data factories
  - Defines common test patterns

### Writing Unit Tests

#### Basic Test Structure
```typescript
import { screen, waitFor } from '@testing-library/react'
import { customRender, setupTestEnv } from '../utils/testUtils'
import { HomePage } from '../../src/routes/index'

describe('Home page', () => {
  beforeEach(() => {
    setupTestEnv()
    resetMockQueryResponses()
  })

  it('renders successfully', async () => {
    customRender(<HomePage />)
    
    expect(await screen.findByText(/Backend is connected/i)).toBeInTheDocument()
  })
})
```

#### Testing Async Operations
```typescript
it('handles loading states', async () => {
  setLoadingState('calendar-events')
  
  customRender(<HomePage />)
  
  expect(screen.getByText(/Loading calendar events/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.queryByText(/Loading calendar events/i)).not.toBeInTheDocument()
  })
})
```

#### Testing Error States
```typescript
it('displays error messages', async () => {
  setErrorState('health', 'Connection timeout')
  
  customRender(<HomePage />)
  
  expect(await screen.findByText(/Backend connection failed/)).toBeInTheDocument()
})
```

### Test Data Factories
- **Event Factory**: `apps/frontend/tests/utils/factories/eventFactory.ts`
  - Creates mock event data for testing
  - Supports customization and overrides
  - Provides realistic test scenarios

### GraphQL Mocks
- **Mock System**: `apps/frontend/tests/utils/mocks/graphqlMocks.ts`
  - Mocks GraphQL queries and mutations
  - Supports different response states (loading, success, error)
  - Provides utilities for setting up test scenarios

## End-to-End Tests

### Overview
- E2E tests use Playwright for browser automation
- Tests are stored in `apps/frontend/tests/e2e`
- Page Object Model (POM) pattern is used for maintainability
- Tests run against multiple browsers and devices

### Test Structure
```
apps/frontend/tests/e2e/
├── basic.spec.ts           # Basic functionality tests
├── homePage.spec.ts        # Home page specific tests
├── global-setup.ts         # Global test setup
├── global-teardown.ts      # Global test cleanup
├── pages/                  # Page Object Models
│   ├── BasePage.ts         # Base page class
│   ├── HomePage.ts         # Home page POM
│   ├── AboutPage.ts        # About page POM
│   └── EventDetailPage.ts  # Event detail page POM
└── utils/                  # E2E test utilities
```

### Running E2E Tests
```bash
# Run all E2E tests
rushx test:e2e
# Run tests in headed mode (visible browser)
rushx test:e2e:headed

# Run tests in debug mode
rushx test:e2e:debug

# Install Playwright browsers
rushx test:e2e:install
```

### Playwright Configuration
- **Config**: `apps/frontend/playwright.config.ts`
  - Supports multiple browsers (Chrome, Firefox, Safari)
  - Mobile device testing (Pixel 5, iPhone 12)
  - Automatic screenshots and video recording on failure
  - Global setup and teardown hooks

### Page Object Model

#### Base Page Class
```typescript
// apps/frontend/tests/e2e/pages/BasePage.ts
export class BasePage {
  protected page: Page
  
  constructor(page: Page) {
    this.page = page
  }
  
  async goto(path: string) {
    await this.page.goto(path)
  }
  
  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector)
  }
}
```

#### Page-Specific Classes
```typescript
// apps/frontend/tests/e2e/pages/HomePage.ts
export class HomePage extends BasePage {
  private calendar = this.page.locator('[data-testid="calendar"]')
  private sidebar = this.page.locator('[data-testid="sidebar"]')
  
  async navigateToHome() {
    await this.goto('/')
  }
  
  async getCalendarEvents() {
    return await this.calendar.locator('[data-testid="event"]').all()
  }
}
```

### Writing E2E Tests

#### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'

test.describe('Home Page', () => {
  let homePage: HomePage
  
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
  })
  
  test('should display calendar events', async () => {
    await homePage.navigateToHome()
    
    const events = await homePage.getCalendarEvents()
    expect(events.length).toBeGreaterThan(0)
  })
})
```

#### Testing User Interactions
```typescript
test('should navigate to event detail', async ({ page }) => {
  const homePage = new HomePage(page)
  const eventDetailPage = new EventDetailPage(page)
  
  await homePage.navigateToHome()
  await homePage.clickFirstEvent()
  
  await expect(page).toHaveURL(/\/event\/\d+/)
  await expect(eventDetailPage.getEventTitle()).toBeVisible()
})
```

## Test Utilities

### Mock System
- **GraphQL Mocks**: Complete GraphQL query/mutation mocking
- **Router Mocks**: TanStack Router mocking for navigation testing
- **Query Client**: React Query testing utilities
## Running Tests

### Development Workflow
```bash
# Run unit tests during development
rushx test:watch
# Check coverage
rushx test:coverage
```