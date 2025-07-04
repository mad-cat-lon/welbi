/**
 * Test Configuration
 * 
 * This file contains configuration and setup patterns for the test suite.
 * It provides reusable configurations and documents testing patterns.
 * 
 * Usage:
 * import { TEST_CONFIG } from './testConfig';
 */

/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 5000,
  LONG_TIMEOUT: 10000,
  SHORT_TIMEOUT: 2000,
  
  // Test data
  DEFAULT_EVENT_ID: 'test-event-1',
  DEFAULT_EVENT_TITLE: 'Test Event',
  
  // Query keys
  QUERY_KEYS: {
    HEALTH: 'health',
    EVENTS: 'events',
    CALENDAR_EVENTS: 'calendar-events',
    EVENT_DETAIL: 'event',
  },
  
  // Status values
  STATUSES: {
    SCHEDULED: 'scheduled',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    DRAFT: 'draft',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network response was not ok',
    GRAPHQL_ERROR: 'GraphQL Error:',
    FETCH_ERROR: 'Failed to fetch',
    TIMEOUT_ERROR: 'Request timeout',
  },
  
  // Loading messages
  LOADING_MESSAGES: {
    EVENTS: 'Loading events...',
    EVENT_DETAIL: 'Loading Event Details...',
    CALENDAR: 'Loading calendar events',
  },
} as const;

/**
 * Test data factories for common scenarios
 */
export const TEST_DATA = {
  /**
   * Creates a basic mock event
   */
  createMockEvent: (overrides = {}) => ({
    id: TEST_CONFIG.DEFAULT_EVENT_ID,
    title: TEST_CONFIG.DEFAULT_EVENT_TITLE,
    description: 'This is a test event description',
    startTime: '2025-01-15T10:00:00Z',
    endTime: '2025-01-15T12:00:00Z',
    duration: 120,
    allDay: false,
    maxParticipants: 20,
    currentParticipants: 8,
    availableSpots: 12,
    registrationRequired: true,
    registrationDeadline: '2025-01-14T18:00:00Z',
    status: TEST_CONFIG.STATUSES.SCHEDULED,
    notes: 'Important notes about this event',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    ...overrides,
  }),
  
  /**
   * Creates multiple mock events
   */
  createMockEvents: (count: number, overrides = {}) => 
    Array.from({ length: count }, (_, index) => 
      TEST_DATA.createMockEvent({ 
        id: `test-event-${index + 1}`,
        title: `Test Event ${index + 1}`,
        ...overrides 
      })
    ),
  
  /**
   * Creates a health response
   */
  createHealthResponse: () => ({ health: 'OK' }),
  
  /**
   * Creates an error response
   */
  createErrorResponse: (message: string) => ({ error: message }),
} as const;

/**
 * Test setup patterns
 */
export const TEST_SETUP = {
  /**
   * Common beforeEach setup
   */
  beforeEach: () => {
    // Reset mocks
    if (typeof vi !== 'undefined') {
      vi.clearAllMocks();
    }
    
    // Reset query responses if available
    if (typeof resetMockQueryResponses === 'function') {
      resetMockQueryResponses();
    }
  },
  
  /**
   * Common afterEach cleanup
   */
  afterEach: () => {
    // Clean up any side effects
    if (typeof vi !== 'undefined') {
      vi.restoreAllMocks();
    }
  },
} as const;

/**
 * Test assertion helpers
 */
export const TEST_ASSERTIONS = {
  /**
   * Asserts that an element is present
   */
  assertElementPresent: (text: string) => {
    expect(document.body).toHaveTextContent(text);
  },
  
  /**
   * Asserts that an element is not present
   */
  assertElementNotPresent: (text: string) => {
    expect(document.body).not.toHaveTextContent(text);
  },
  
  /**
   * Asserts that loading state is shown
   */
  assertLoadingState: (message: string) => {
    expect(document.body).toHaveTextContent(message);
  },
  
  /**
   * Asserts that error state is shown
   */
  assertErrorState: (message: string) => {
    expect(document.body).toHaveTextContent(message);
  },
} as const;

/**
 * Test patterns for common scenarios
 */
export const TEST_PATTERNS = {
  /**
   * Pattern for testing component rendering
   */
  componentRendering: {
    description: 'Component renders successfully',
    test: (component: React.ReactElement, expectedText: string) => {
      const { container } = render(component);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    },
  },
  
  /**
   * Pattern for testing loading states
   */
  loadingState: {
    description: 'Component shows loading state',
    test: (component: React.ReactElement, loadingText: string) => {
      render(component);
      expect(screen.getByText(loadingText)).toBeInTheDocument();
    },
  },
  
  /**
   * Pattern for testing error states
   */
  errorState: {
    description: 'Component shows error state',
    test: (component: React.ReactElement, errorText: string) => {
      render(component);
      expect(screen.getByText(errorText)).toBeInTheDocument();
    },
  },
  
  /**
   * Pattern for testing async operations
   */
  asyncOperation: {
    description: 'Component handles async operation',
    test: async (component: React.ReactElement, expectedText: string) => {
      render(component);
      await waitFor(() => {
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      }, { timeout: TEST_CONFIG.DEFAULT_TIMEOUT });
    },
  },
} as const;

// Type declarations for better IntelliSense
declare global {
  const vi: any;
  const resetMockQueryResponses: () => void;
  const render: any;
  const screen: any;
  const waitFor: any;
  const expect: any;
} 