import { vi } from 'vitest'

export const mockHealthResponse = { health: 'OK' }

export const mockCalendarEvents = [
  {
    id: '1',
    title: 'Mock Calendar Event',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled',
    description: 'Test description',
    currentParticipants: 2,
    maxParticipants: 10,
  },
]

export const mockSidebarEvents = [
  {
    id: '2',
    title: 'Mock Sidebar Event',
    description: '',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    currentParticipants: 1,
    maxParticipants: 5,
    registrationRequired: false,
    status: 'scheduled',
  },
]

export const mockEventDetail = {
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
  status: 'scheduled',
  notes: 'Important notes about this event',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-10T00:00:00Z',
}

export let queryResponses: Record<string, any> = {
  health: { data: mockHealthResponse, isLoading: false, error: null },
  events: { data: { events: mockSidebarEvents }, isLoading: false, error: null },
  'calendar-events': { data: { events: mockCalendarEvents }, isLoading: false, error: null },
  event: { data: { event: mockEventDetail }, isLoading: false, error: null },
}

export const mockUseQuery = vi.fn(({ queryKey }: any) => {
  const key = queryKey[0]
  const response = queryResponses[key]

  console.log(`🔍 useQuery for "${key}":`, response)

  return (
    response || {
      data: undefined,
      isLoading: false,
      error: null,
    }
  )
})

export function setMockQueryResponse(key: string, response: any) {
  queryResponses[key] = response
}

export function resetMockQueryResponses() {
  queryResponses = {
    health: { data: mockHealthResponse, isLoading: false, error: null },
    events: { data: { events: mockSidebarEvents }, isLoading: false, error: null },
    'calendar-events': { data: { events: mockCalendarEvents }, isLoading: false, error: null },
    event: { data: { event: mockEventDetail }, isLoading: false, error: null },
  }
}

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: mockUseQuery,
  }
})
