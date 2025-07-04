// tests/web/HomePage.test.tsx
import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import * as Router from '@tanstack/react-router'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '../utils/mocks/graphqlMocks.ts'

import {
  mockUseQuery,
  resetMockQueryResponses,
  setMockQueryResponse,
} from '../utils/mocks/graphqlMocks.ts'
import { HomePage } from '../../src/routes/index.tsx'
import { customRender, setupTestEnv } from '../utils/testUtils.tsx'

describe('Home page', () => {
  beforeEach(() => {
    setupTestEnv()
    resetMockQueryResponses()
  })

  it('renders the health status', async () => {
    customRender(<HomePage />)

    expect(await screen.findByText(/Backend is connected successfully/i)).toBeInTheDocument()
  })

  it('displays error message if health check fails', async () => {
    setMockQueryResponse('health', {
      data: undefined,
      isLoading: false,
      error: new Error('Connection timeout'),
    })

    customRender(<HomePage />)

    expect(await screen.findByText(/Backend connection failed: Connection timeout/)).toBeInTheDocument()
  })
  

  it('renders calendar events', async () => {
    customRender(<HomePage />)

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
  
    customRender(<HomePage />)
  
    expect(screen.getByText(/Loading calendar events/i)).toBeInTheDocument()
  })

  it('renders calendar without crashing when there are no events', async () => {

    setMockQueryResponse('calendar-events', {
      data: { events: [] },
      isLoading: false,
      error: null,
    })
  
    customRender(<HomePage />)
  
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
  
    customRender(<HomePage />)
  
    await waitFor(() => {
      expect(screen.getByText(/Events Calendar/i)).toBeInTheDocument()
    })
  
  })
  
  it('renders sidebar events', async () => {
    customRender(<HomePage />)

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

    customRender(<HomePage />)
  
    await waitFor(() => {
      expect(screen.getByText(/No events found/i)).toBeInTheDocument()
    })
  })

})

