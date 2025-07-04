import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import { describe, it, beforeEach, vi } from 'vitest'
import { customRender, setupTestEnv, getQueryClient, mockNavigate } from '../utils/testUtils'
import { setMockQueryResponse, resetMockQueryResponses, mockEventDetail } from '../utils/mocks/graphqlMocks'
import { EventDetailPage } from '../../src/routes/event.$eventId'

describe('Event Detail Page', () => {
  beforeEach(() => {
    setupTestEnv({
      path: '/event/test-event-1',
      params: { eventId: 'test-event-1' },
      search: { year: 2025, month: 7 },
    })
    setMockQueryResponse('event', {
      data: { event: mockEventDetail },
      isLoading: false,
      error: null,
    })
  })

  it('renders event details correctly', async () => {
    customRender(<EventDetailPage />)

    await screen.findByText('Test Event')
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

    customRender(<EventDetailPage />)
    expect(screen.getByText('Loading Event Details...')).toBeInTheDocument()
  })

  it('displays error message when event fetch fails', async () => {
    setMockQueryResponse('event', {
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch event'),
    })

    customRender(<EventDetailPage />)

    expect(await screen.findByText('Error Loading Event')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch event')).toBeInTheDocument()
  })

  it('shows event not found when event data is null', async () => {
    setMockQueryResponse('event', {
      data: { event: null },
      isLoading: false,
      error: null,
    })

    customRender(<EventDetailPage />)
    expect(await screen.findByText('Event Not Found')).toBeInTheDocument()
    expect(screen.getByText('The requested event could not be found.')).toBeInTheDocument()
  })

  it('displays date and time information correctly', async () => {
    customRender(<EventDetailPage />)

    await screen.findByText('📅 Date & Time')

    const startBox = screen.getByText('Start Time').closest('div')!
    expect(within(startBox).getByText('Wednesday, January 15, 2025')).toBeInTheDocument()

    const endBox = screen.getByText('End Time').closest('div')!
    expect(within(endBox).getByText('Wednesday, January 15, 2025')).toBeInTheDocument()

    expect(screen.getByText('Duration')).toBeInTheDocument()
    expect(screen.getByText('2 hours 0 minutes')).toBeInTheDocument()
  })

  it('handles back button click', async () => {
    customRender(<EventDetailPage />)

    await screen.findByText('← Back to Calendar')

    screen.getByText('← Back to Calendar').click()
    expect(window.history.back).toHaveBeenCalledTimes(1)
  })

  it('shows fully booked message when no spots available', async () => {
    const fullEvent = { ...mockEventDetail, currentParticipants: 20, availableSpots: 0 }
    setMockQueryResponse('event', { data: { event: fullEvent }, isLoading: false, error: null })

    customRender(<EventDetailPage />)

    expect(await screen.findByText('Fully booked')).toBeInTheDocument()
  })

  it('displays notes when available', async () => {
    customRender(<EventDetailPage />)
    expect(await screen.findByText('📝 Notes')).toBeInTheDocument()
    expect(screen.getByText('Important notes about this event')).toBeInTheDocument()
  })

  it('handles event without notes gracefully', async () => {
    const eventWithoutNotes = { ...mockEventDetail, notes: null }
    setMockQueryResponse('event', { data: { event: eventWithoutNotes }, isLoading: false, error: null })

    customRender(<EventDetailPage />)
    await screen.findByText('Test Event')

    expect(screen.queryByText('📝 Notes')).not.toBeInTheDocument()
  })

  it('displays all day event badge when applicable', async () => {
    const allDay = { ...mockEventDetail, allDay: true }
    setMockQueryResponse('event', { data: { event: allDay }, isLoading: false, error: null })

    customRender(<EventDetailPage />)
    expect(await screen.findByText('All Day Event')).toBeInTheDocument()
  })

  it('handles different event statuses correctly', async () => {
    const completed = { ...mockEventDetail, status: 'completed' }
    setMockQueryResponse('event', { data: { event: completed }, isLoading: false, error: null })

    customRender(<EventDetailPage />)
    expect(await screen.findByText('Completed')).toBeInTheDocument()
  })

  it('handles event without capacity limit', async () => {
    const noCap = {
      ...mockEventDetail,
      maxParticipants: null,
      currentParticipants: null,
      availableSpots: null,
    }

    setMockQueryResponse('event', { data: { event: noCap }, isLoading: false, error: null })
    customRender(<EventDetailPage />)

    expect(await screen.findByText('No capacity limit')).toBeInTheDocument()
  })

  it('handles missing registration deadline gracefully', async () => {
    const noDeadline = { ...mockEventDetail, registrationDeadline: null }
    setMockQueryResponse('event', { data: { event: noDeadline }, isLoading: false, error: null })

    customRender(<EventDetailPage />)
    await screen.findByText('Test Event')

    expect(screen.queryByText('Registration Deadline')).not.toBeInTheDocument()
  })

  it('handles missing duration gracefully', async () => {
    const noDuration = { ...mockEventDetail, duration: null }
    setMockQueryResponse('event', { data: { event: noDuration }, isLoading: false, error: null })

    customRender(<EventDetailPage />)
    await screen.findByText('Test Event')

    expect(screen.queryByText('Duration')).not.toBeInTheDocument()
  })

  it('handles minimal event without optional fields', async () => {
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

    customRender(<EventDetailPage />)
    await screen.findByText('Minimal Event')

    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Registration Required')).not.toBeInTheDocument()
    expect(screen.queryByText('All Day Event')).not.toBeInTheDocument()
  })
})
