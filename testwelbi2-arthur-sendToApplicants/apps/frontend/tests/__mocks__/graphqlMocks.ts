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

export const mockUseQuery = vi.fn(({ queryKey, queryFn }: any) => {
  console.log('🔍 Mock useQuery called with queryKey:', queryKey)
  
  if (queryKey[0] === 'health') {
    console.log('✅ Returning health data')
    return {
      data: mockHealthResponse,
      isLoading: false,
      error: null,
    }
  }
  
  if (queryKey[0] === 'events') {
    console.log('✅ Returning sidebar events data')
    return {
      data: { events: mockSidebarEvents },
      isLoading: false,
      error: null,
    }
  }
  
  if (queryKey[0] === 'calendar-events') {
    console.log('✅ Returning calendar events data')
    return {
      data: { events: mockCalendarEvents },
      isLoading: false,
      error: null,
    }
  }
  
  console.warn('❌ Unknown query key:', queryKey)
  return {
    data: undefined,
    isLoading: false,
    error: null,
  }
})

// Mock the useQuery hook
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: mockUseQuery,
  }
})

// Mock the execute function
vi.mock('../../src/graphql/execute', async () => {
  return {
    execute: vi.fn((query: any, variables?: any) => {
      console.log('🔍 Mock execute called')
      console.log('🔍 Query:', query)
      console.log('🔍 Variables:', variables)
      
      // Try to extract query string from various possible formats
      let queryString = ''
      
      if (typeof query === 'string') {
        queryString = query
      } else if (query && query.loc && query.loc.source && query.loc.source.body) {
        queryString = query.loc.source.body
      } else if (query && typeof query.toString === 'function') {
        queryString = query.toString()
      } else if (query && query.kind === 'Document') {
        queryString = query.loc?.source?.body || ''
      } else {
        // If we can't extract the query string, try to identify by other means
        console.log('🔍 Query object structure:', JSON.stringify(query, null, 2))
        
        // Check if it's one of our known queries by looking at the query key
        if (variables && variables.limit === 3000) {
          console.log('✅ Detected CalendarEvents query by limit')
          return Promise.resolve({ events: mockCalendarEvents })
        }
        
        if (variables && variables.limit === 5) {
          console.log('✅ Detected Events query by limit')
          return Promise.resolve({ events: mockSidebarEvents })
        }
        
        if (!variables) {
          console.log('✅ Detected Health query (no variables)')
          return Promise.resolve(mockHealthResponse)
        }
        
        console.warn('❌ Could not identify query')
        return Promise.resolve({})
      }
      
      console.log('🔍 Extracted query string:', queryString)
      
      // Check for specific query names
      if (queryString.includes('Health')) {
        console.log('✅ Returning health response')
        return Promise.resolve(mockHealthResponse)
      }
      
      if (queryString.includes('CalendarEvents')) {
        console.log('✅ Returning calendar events response')
        return Promise.resolve({ events: mockCalendarEvents })
      }
      
      if (queryString.includes('Events')) {
        console.log('✅ Returning sidebar events response')
        return Promise.resolve({ events: mockSidebarEvents })
      }
      
      console.warn('❌ No mock found for query')
      return Promise.resolve({})
    }),
  }
})
