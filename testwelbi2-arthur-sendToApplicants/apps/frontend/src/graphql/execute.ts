import type { TypedDocumentString } from './graphql'

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const GRAPHQL_ENDPOINT = 'http://127.0.0.1:4000/graphql';
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/graphql-response+json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const result = await response.json()
  
  // Handle GraphQL errors
  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors.map((e: any) => e.message).join(', ')}`)
  }
  
  // Return just the data portion
  return result.data as TResult
} 