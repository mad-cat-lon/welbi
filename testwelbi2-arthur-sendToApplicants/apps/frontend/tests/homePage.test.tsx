// tests/web/HomePage.test.tsx
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
} from './mocks/graphqlMocks.ts'


import { routeTree } from '../src/routeTree.gen.ts'
import { HomePage } from '../src/routes/index'

import { graphql } from '../src/graphql'

const HealthQuery = graphql(`
  query Health {
    health
  }
`)

const EventsQuery = graphql(`
  query Events($limit: Int) {
    events(limit: $limit) {
      id
      title
      description
      startTime
      endTime
      currentParticipants
      maxParticipants
      registrationRequired
      status
    }
  }
`)

const CalendarEventsQuery = graphql(`
  query CalendarEvents($limit: Int) {
    events(limit: $limit) {
      id
      title
      startTime
      endTime
      status
      description
      currentParticipants
      maxParticipants
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
    },
  }
})

vi.mock('@tanstack/router-devtools', () => ({
    TanStackRouterDevtools: () => null,
}))

// Mock the execute function
vi.mock('../src/graphql/execute', () => ({
  execute: vi.fn(),
}))

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    resetMockQueryResponses()
  })

  it('renders the health status', async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}>
                <HomePage />
            </RouterProvider>
        </QueryClientProvider>
    )

    expect(await screen.findByText(/Backend is connected successfully/i)).toBeInTheDocument()
  })

  it('displays error message if health check fails', async () => {
    setMockQueryResponse('health', {
      data: undefined,
      isLoading: false,
      error: new Error('Connection timeout'),
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <HomePage />
        </RouterProvider>
      </QueryClientProvider>
    )
  
    expect(await screen.findByText(/Backend connection failed: Connection timeout/)).toBeInTheDocument()
  })
  

  it('renders calendar events', async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}>
                <HomePage />
            </RouterProvider>
        </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/Loading calendar events/i)).not.toBeInTheDocument()
    }, { timeout: 5000 })

    await waitFor(() => {
      expect(screen.getByText(/Mock Calendar Event/)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows loading message while fetching calendar events', () => {
    setMockQueryResponse('calendar-events', {
      data: null,
      isLoading: true,
      error: null,
    })
  
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <HomePage />
        </RouterProvider>
      </QueryClientProvider>
    )
  
    expect(screen.getByText(/Loading calendar events/i)).toBeInTheDocument()
  })

  it('renders calendar without crashing when there are no events', async () => {

    setMockQueryResponse('calendar-events', {
      data: { events: [] },
      isLoading: false,
      error: null,
    })
  
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <HomePage />
        </RouterProvider>
      </QueryClientProvider>
    )
  
    await waitFor(() => {
      expect(screen.queryByText(/Loading calendar events/i)).not.toBeInTheDocument()
    })
  
    expect(screen.getByText(/Events Calendar/)).toBeInTheDocument()
  })

  it('handles calendar events with missing fields gracefully', async () => {
    setMockQueryResponse('calendar-events', {
      data: {
        events: [{ id: 'x', title: null, startTime: null, endTime: null, status: null }]
      },
      isLoading: false,
      error: null,
    })
  
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <HomePage />
        </RouterProvider>
      </QueryClientProvider>
    )
  
    await waitFor(() => {
      expect(screen.getByText(/Events Calendar/i)).toBeInTheDocument()
    })
  
  })
  
  it('renders sidebar events', async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}>
                <HomePage />
            </RouterProvider>
        </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/Loading events/i)).not.toBeInTheDocument()
    }, { timeout: 5000 })

    await waitFor(() => {
      expect(screen.getByText(/Mock Sidebar Event/)).toBeInTheDocument()
    }, { timeout: 5000 })

    const eventTitle = screen.getByText(/Mock Sidebar Event/)
    expect(eventTitle).toBeInTheDocument()

    const card = eventTitle.closest('div')
    const status = within(card!).getByText(/Status: scheduled/i)
    expect(status).toBeInTheDocument()
  })

  it('renders message when there are no sidebar events', async () => {
  
    setMockQueryResponse('events', {
      data: { events: [] },
      isLoading: false,
      error: null,
    })

    setMockQueryResponse('health', {
      data: { health: 'OK' },
      isLoading: false,
      error: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <HomePage />
        </RouterProvider>
      </QueryClientProvider>
    )
  
    await waitFor(() => {
      expect(screen.getByText(/No events found/i)).toBeInTheDocument()
    })
  })

})

