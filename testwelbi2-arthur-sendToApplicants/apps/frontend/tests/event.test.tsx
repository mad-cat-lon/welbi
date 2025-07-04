import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import * as Router from '@tanstack/react-router'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './mocks/graphqlMocks.ts'

import {
  mockUseQuery,
  resetMockQueryResponses,
  setMockQueryResponse,
  mockEventDetail
} from './mocks/graphqlMocks.ts'

import { routeTree } from '../src/routeTree.gen.ts'
import { EventDetailPage } from '../src/routes/event.$eventId'

import { graphql } from '../src/graphql'

const EventDetailQuery = graphql(`
  query EventDetail($id: ID!) {
    event(id: $id) {
      id
      title
      description
      startTime
      endTime
      duration
      allDay
      maxParticipants
      currentParticipants
      availableSpots
      registrationRequired
      registrationDeadline
      status
      notes
      createdAt
      updatedAt
    }
  }
`)

const router = createRouter({ routeTree })
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
})

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof Router>('@tanstack/react-router')
  return {
    ...actual,
    Route: {
      useSearch: () => ({ year: 2025, month: 7 }),
      useNavigate: () => mockNavigate,
      useParams: () => ({ eventId: 'test-event-1' })
    },
  }
})

vi.mock('@tanstack/router-devtools', () => ({
  TanStackRouterDevtools: () => null,
}))

vi.mock('../src/graphql/execute', () => ({
  execute: vi.fn(),
}))

const mockHistoryBack = vi.fn()

describe('Event Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    resetMockQueryResponses()
    mockHistoryBack.mockReset()
    window.history.back = mockHistoryBack
    setMockQueryResponse('event', {
      data: { event: mockEventDetail },
      isLoading: false,
      error: null,
    })
    window.history.pushState({}, '', '/event/test-event-1')
  })
  

  it('renders event details correctly', async () => {

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    expect(screen.getByText('This is a test event description')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('Registration Required')).toBeInTheDocument()
  })

  it('shows loading state while fetching event data', () => {
    setMockQueryResponse('event', {
      data: null,
      isLoading: true,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    expect(screen.getByText('Loading Event Details...')).toBeInTheDocument()
  })

  it('displays error message when event fetch fails', async () => {
    setMockQueryResponse('event', {
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch event'),
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    expect(await screen.findByText('Error Loading Event')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch event')).toBeInTheDocument()
  })

  it('shows event not found when event data is null', async () => {
    setMockQueryResponse('event', {
      data: { event: null },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    expect(await screen.findByText('Event Not Found')).toBeInTheDocument()
    expect(screen.getByText('The requested event could not be found.')).toBeInTheDocument()
  })

  it('displays date and time information correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📅 Date & Time')).toBeInTheDocument()
    })

    const startBox = screen.getByText('Start Time').closest('div')!
    expect(within(startBox).getByText('Wednesday, January 15, 2025')).toBeInTheDocument()
    
    const endBox = screen.getByText('End Time').closest('div')!
    expect(within(endBox).getByText('Wednesday, January 15, 2025')).toBeInTheDocument()

    expect(screen.getByText('Duration')).toBeInTheDocument()
    expect(screen.getByText('2 hours 0 minutes')).toBeInTheDocument()
  })

  it('displays participation information correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('👥 Participation')).toBeInTheDocument()
    })

    expect(screen.getByText('Capacity')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('/ 20')).toBeInTheDocument()
    expect(screen.getByText('12 spots available')).toBeInTheDocument()
  })

  it('shows fully booked message when no spots available', async () => {
    const fullyBookedEvent = {
      ...mockEventDetail,
      currentParticipants: 20,
      availableSpots: 0,
    }

    setMockQueryResponse('event', {
      data: { event: fullyBookedEvent },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Fully booked')).toBeInTheDocument()
    })
  })

  // TODO: Fix this test 
  // it('displays registration deadline when available', async () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <RouterProvider router={router}>
  //         <EventDetailPage />
  //       </RouterProvider>
  //     </QueryClientProvider>
  //   )

  //   await waitFor(() => {
  //     expect(screen.getByText('Registration Deadline')).toBeInTheDocument()
  //   })
  //   const deadlineBox = screen.getByText('Registration Deadline').closest('div')!
  //   expect(within(deadlineBox).getByText(/Jan 14/)).toBeInTheDocument()
  //   expect(within(deadlineBox).getByText(/6:00/)).toBeInTheDocument()
  // })   

  it('displays additional information correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📋 Additional Information')).toBeInTheDocument()
    })

    expect(screen.getByText('Event ID')).toBeInTheDocument()
    expect(screen.getByText('test-event-1')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    
    const createdDate = new Date('2025-01-01T00:00:00Z')
    const expectedCreatedDate = createdDate.toLocaleDateString()
    expect(screen.getByText(expectedCreatedDate)).toBeInTheDocument()

    expect(screen.getByText('Last Updated')).toBeInTheDocument()
    const updatedDate = new Date('2025-01-10T00:00:00Z')
    const expectedUpdatedDate = updatedDate.toLocaleDateString()
    expect(screen.getByText(expectedUpdatedDate)).toBeInTheDocument()
  })

  it('displays notes when available', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📝 Notes')).toBeInTheDocument()
    })

    expect(screen.getByText('Important notes about this event')).toBeInTheDocument()
  })

  it('handles event without notes gracefully', async () => {
    const eventWithoutNotes = {
      ...mockEventDetail,
      notes: null,
    }

    setMockQueryResponse('event', {
      data: { event: eventWithoutNotes },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    expect(screen.queryByText('📝 Notes')).not.toBeInTheDocument()
  })

  it('displays all day event badge when applicable', async () => {
    const allDayEvent = {
      ...mockEventDetail,
      allDay: true,
    }

    setMockQueryResponse('event', {
      data: { event: allDayEvent },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('All Day Event')).toBeInTheDocument()
    })
  })

  it('handles different event statuses correctly', async () => {
    const completedEvent = {
      ...mockEventDetail,
      status: 'completed',
    }

    setMockQueryResponse('event', {
      data: { event: completedEvent },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })
  })

  it('handles event without capacity limit', async () => {
    const unlimitedEvent = {
      ...mockEventDetail,
      maxParticipants: null,
      currentParticipants: null,
      availableSpots: null,
    }

    setMockQueryResponse('event', {
      data: { event: unlimitedEvent },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No capacity limit')).toBeInTheDocument()
    })
  })

  it('handles event without registration deadline', async () => {
    const eventWithoutDeadline = {
      ...mockEventDetail,
      registrationDeadline: null,
    }

    setMockQueryResponse('event', {
      data: { event: eventWithoutDeadline },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    expect(screen.queryByText('Registration Deadline')).not.toBeInTheDocument()
  })

  it('handles event without duration', async () => {
    const eventWithoutDuration = {
      ...mockEventDetail,
      duration: null,
    }

    setMockQueryResponse('event', {
      data: { event: eventWithoutDuration },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    expect(screen.queryByText('Duration')).not.toBeInTheDocument()
  })

  it('handles back button click', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('← Back to Calendar')).toBeInTheDocument()
    })

    const backButton = screen.getByText('← Back to Calendar')
    backButton.click()

    expect(mockHistoryBack).toHaveBeenCalledTimes(1)
  })

  it('handles event with missing optional fields gracefully', async () => {
    const minimalEvent = {
      id: 'minimal-event',
      title: 'Minimal Event',
      description: null,
      startTime: '2025-01-15T10:00:00Z',
      endTime: '2025-01-15T12:00:00Z',
      duration: null,
      allDay: false,
      maxParticipants: null,
      currentParticipants: null,
      availableSpots: null,
      registrationRequired: false,
      registrationDeadline: null,
      status: 'scheduled',
      notes: null,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    }

    setMockQueryResponse('event', {
      data: { event: minimalEvent },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <EventDetailPage />
        </RouterProvider>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Minimal Event')).toBeInTheDocument()
    })

    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Registration Required')).not.toBeInTheDocument()
    expect(screen.queryByText('All Day Event')).not.toBeInTheDocument()
  })
})
