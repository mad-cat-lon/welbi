/**
 * Event Factory
 * 
 * This factory provides utilities for creating mock event data for testing.
 * It uses faker.js to generate realistic test data and provides flexible
 * configuration options for different test scenarios.
 * 
 * Usage:
 * import { buildEvent, buildEventList } from './factories/eventFactory';
 * 
 * const event = buildEvent({ status: 'cancelled' });
 * const events = buildEventList(5, { registrationRequired: true });
 */

import { faker } from '@faker-js/faker'

/**
 * Event status types for consistent testing
 */
export const EVENT_STATUSES = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  DRAFT: 'draft',
} as const;

export type EventStatus = typeof EVENT_STATUSES[keyof typeof EVENT_STATUSES];

/**
 * Base event structure for type safety
 */
export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  currentParticipants: number;
  maxParticipants: number;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  duration?: number;
  allDay?: boolean;
  availableSpots?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Builds a single mock event with realistic data
 * @param overrides - Properties to override in the generated event
 * @returns Mock event object
 */
export function buildEvent(overrides: Partial<BaseEvent> = {}): BaseEvent {
  const startTime = faker.date.future();
  const endTime = new Date(startTime.getTime() + faker.number.int({ min: 30, max: 240 }) * 60000);
  
  const baseEvent: BaseEvent = {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: faker.helpers.arrayElement(Object.values(EVENT_STATUSES)),
    currentParticipants: faker.number.int({ min: 0, max: 10 }),
    maxParticipants: faker.number.int({ min: 10, max: 50 }),
    registrationRequired: faker.datatype.boolean(),
    registrationDeadline: faker.date.future().toISOString(),
    duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
    allDay: false,
    availableSpots: 0, // Will be calculated
    notes: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };

  // Calculate available spots
  baseEvent.availableSpots = Math.max(0, baseEvent.maxParticipants - baseEvent.currentParticipants);

  return {
    ...baseEvent,
    ...overrides,
  };
}

/**
 * Builds a list of mock events
 * @param count - Number of events to generate
 * @param overrides - Properties to override in all generated events
 * @returns Array of mock events
 */
export function buildEventList(count: number, overrides: Partial<BaseEvent> = {}): BaseEvent[] {
  return Array.from({ length: count }, () => buildEvent(overrides));
}

/**
 * Builds events with specific status for testing different scenarios
 * @param status - Event status to use
 * @param count - Number of events to generate
 * @returns Array of mock events with specified status
 */
export function buildEventsWithStatus(status: EventStatus, count: number = 1): BaseEvent[] {
  return buildEventList(count, { status });
}

/**
 * Builds events that require registration
 * @param count - Number of events to generate
 * @returns Array of mock events requiring registration
 */
export function buildRegistrationRequiredEvents(count: number = 1): BaseEvent[] {
  return buildEventList(count, { 
    registrationRequired: true,
    registrationDeadline: faker.date.future().toISOString(),
  });
}

/**
 * Builds events that are full (no available spots)
 * @param count - Number of events to generate
 * @returns Array of mock events with no available spots
 */
export function buildFullEvents(count: number = 1): BaseEvent[] {
  return buildEventList(count, {
    currentParticipants: 20,
    maxParticipants: 20,
    availableSpots: 0,
  });
}

/**
 * Builds events that are happening today
 * @param count - Number of events to generate
 * @returns Array of mock events happening today
 */
export function buildTodayEvents(count: number = 1): BaseEvent[] {
  const today = new Date();
  const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0);
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  return buildEventList(count, {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: EVENT_STATUSES.SCHEDULED,
  });
}

/**
 * Builds events that are happening in the future
 * @param count - Number of events to generate
 * @param daysFromNow - Number of days from now (default: 7)
 * @returns Array of mock events happening in the future
 */
export function buildFutureEvents(count: number = 1, daysFromNow: number = 7): BaseEvent[] {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromNow);
  const startTime = new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 14, 0, 0);
  const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

  return buildEventList(count, {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: EVENT_STATUSES.SCHEDULED,
  });
}

/**
 * Builds events that are in the past
 * @param count - Number of events to generate
 * @param daysAgo - Number of days ago (default: 7)
 * @returns Array of mock events that happened in the past
 */
export function buildPastEvents(count: number = 1, daysAgo: number = 7): BaseEvent[] {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - daysAgo);
  const startTime = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), 10, 0, 0);
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  return buildEventList(count, {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: EVENT_STATUSES.COMPLETED,
  });
}