/**
 * GraphQL Mocks
 * 
 * This file provides comprehensive mocking for GraphQL operations used in tests.
 * It includes mock data, query responses, and utility functions for setting up
 * different test scenarios.
 * 
 * Key Features:
 * - Type-safe mock data structures
 * - Flexible response configuration
 * - Utility functions for test setup
 * - Consistent mock patterns across tests
 * 
 * Usage:
 * import { setMockQueryResponse, resetMockQueryResponses } from './mocks/graphqlMocks';
 * 
 * setMockQueryResponse('events', { data: mockEvents, isLoading: false, error: null });
 * resetMockQueryResponses();
 */

import { vi } from 'vitest'
import { buildEvent, EVENT_STATUSES } from '../factories/eventFactory'

/**
 * Mock response types for type safety
 */
export interface MockQueryResponse<T = any> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface HealthResponse {
  health: string;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  currentParticipants: number;
  maxParticipants: number;
  registrationRequired: boolean;
  status: string;
}

export interface EventDetailResponse extends EventResponse {
  duration: number;
  allDay: boolean;
  availableSpots: number;
  registrationDeadline: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Default mock responses for common scenarios
 */
export const mockHealthResponse: HealthResponse = { 
  health: 'OK' 
};

export const mockCalendarEvents: EventResponse[] = [
  {
    id: '1',
    title: 'Mock Calendar Event',
    description: 'Test description',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: EVENT_STATUSES.SCHEDULED,
    currentParticipants: 2,
    maxParticipants: 10,
    registrationRequired: false,
  },
];

export const mockSidebarEvents: EventResponse[] = [
  {
    id: '2',
    title: 'Mock Sidebar Event',
    description: 'Sidebar event description',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    currentParticipants: 1,
    maxParticipants: 5,
    registrationRequired: false,
    status: EVENT_STATUSES.SCHEDULED,
  },
];

export const mockEventDetail: EventDetailResponse = {
  id: 'test-event-1',
  title: 'Test Event',
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
  status: EVENT_STATUSES.SCHEDULED,
  notes: 'Important notes about this event',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-10T00:00:00Z',
};

/**
 * Query response registry for dynamic mock configuration
 */
export let queryResponses: Record<string, MockQueryResponse> = {
  health: { data: mockHealthResponse, isLoading: false, error: null },
  events: { data: { events: mockSidebarEvents }, isLoading: false, error: null },
  'calendar-events': { data: { events: mockCalendarEvents }, isLoading: false, error: null },
  event: { data: { event: mockEventDetail }, isLoading: false, error: null },
};

/**
 * Mock useQuery function that returns configured responses
 * @param options - Query options including queryKey
 * @returns Mock query response
 */
export const mockUseQuery = vi.fn(({ queryKey }: { queryKey: string[] }) => {
  const key = queryKey[0];
  const response = queryResponses[key];

  return (
    response || {
      data: undefined,
      isLoading: false,
      error: null,
    }
  );
});

/**
 * Sets a mock response for a specific query key
 * @param key - Query key to set response for
 * @param response - Mock response to return
 */
export function setMockQueryResponse(key: string, response: MockQueryResponse) {
  queryResponses[key] = response;
}

/**
 * Resets all mock query responses to default values
 */
export function resetMockQueryResponses() {
  queryResponses = {
    health: { data: mockHealthResponse, isLoading: false, error: null },
    events: { data: { events: mockSidebarEvents }, isLoading: false, error: null },
    'calendar-events': { data: { events: mockCalendarEvents }, isLoading: false, error: null },
    event: { data: { event: mockEventDetail }, isLoading: false, error: null },
  };
}

/**
 * Sets up loading state for a query
 * @param key - Query key to set loading state for
 */
export function setLoadingState(key: string) {
  setMockQueryResponse(key, {
    data: undefined,
    isLoading: true,
    error: null,
  });
}

/**
 * Sets up error state for a query
 * @param key - Query key to set error state for
 * @param errorMessage - Error message to display
 */
export function setErrorState(key: string, errorMessage: string) {
  setMockQueryResponse(key, {
    data: undefined,
    isLoading: false,
    error: new Error(errorMessage),
  });
}

/**
 * Sets up success state with custom data for a query
 * @param key - Query key to set success state for
 * @param data - Data to return
 */
export function setSuccessState(key: string, data: any) {
  setMockQueryResponse(key, {
    data,
    isLoading: false,
    error: null,
  });
}

/**
 * Sets up empty data state for a query
 * @param key - Query key to set empty state for
 */
export function setEmptyState(key: string) {
  setMockQueryResponse(key, {
    data: { events: [] },
    isLoading: false,
    error: null,
  });
}

/**
 * Creates mock events using the factory
 * @param count - Number of events to create
 * @param overrides - Properties to override
 * @returns Array of mock events
 */
export function createMockEvents(count: number = 1, overrides = {}) {
  return Array.from({ length: count }, () => buildEvent(overrides));
}

/**
 * Sets up mock events for testing
 * @param key - Query key to set events for
 * @param count - Number of events to create
 * @param overrides - Properties to override
 */
export function setMockEvents(key: string, count: number = 1, overrides = {}) {
  const events = createMockEvents(count, overrides);
  setSuccessState(key, { events });
}

// Mock the @tanstack/react-query module
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: mockUseQuery,
  };
});
