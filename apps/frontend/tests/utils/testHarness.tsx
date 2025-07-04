import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from '../../src/routeTree.gen'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { vi } from 'vitest'
import * as Router from '@tanstack/react-router'
import { resetMockQueryResponses } from './mocks/graphqlMocks'

let currentPath   = '/'
let currentParams:  Record<string, string>   = {}
let currentSearch: Record<string, unknown> = {}

const getCurrentParams  = () => currentParams
const getCurrentSearch  = () => currentSearch


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0, staleTime: 0 },
  },
})

const router = createRouter({ routeTree })

export function TestAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>{children}</RouterProvider>
    </QueryClientProvider>
  )
}

export function getQueryClient() {
  return queryClient
}

export function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestAppWrapper, ...options })
}
export const mockNavigate = vi.fn()

type TestEnvOptions = {
  path?:   string
  params?: Record<string, string>
  search?: Record<string, unknown>
}

export function setupTestEnv({
  path   = '/',
  params = {},
  search = {},
}: TestEnvOptions = {}) {
  vi.clearAllMocks()
  queryClient.clear()
  resetMockQueryResponses()

  currentPath   = path
  currentParams = params
  currentSearch = search

  window.history.pushState({}, '', path)
  window.history.back = vi.fn()
}

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof Router>('@tanstack/react-router')
  return {
    ...actual,
    Route: {
      useParams: () => currentParams,
      useSearch: () => currentSearch,
      useNavigate: () => mockNavigate,
    },
  }
})

vi.mock('@tanstack/router-devtools', () => ({
  TanStackRouterDevtools: () => null,
}))

vi.mock('../../src/graphql/execute', () => ({
  execute: vi.fn(),
}))