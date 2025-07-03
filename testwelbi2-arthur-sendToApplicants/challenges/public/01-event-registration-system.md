# Challenge 1: Event Registration System

**Difficulty**: Medium | **Estimated Time**: 2-3 hours | **Focus**: Full-Stack Feature Development

## Context

You're working on a wellness event management platform. The current system allows users to view events, but there's no way for residents to register for events they're interested in. Your task is to implement a complete event registration system.

## Current State

- Events are displayed on the homepage and detail pages
- The database schema already includes an `eventParticipants` table for tracking registrations
- Basic GraphQL queries exist for fetching events
- The permission system using CASL is already implemented
- Event capacity tracking fields (`maxParticipants`, `currentParticipants`) exist

## Your Task

Implement a complete event registration system that allows users to:
1. Register for events they're interested in
2. Cancel their registration if plans change
3. See their registration status on event pages
4. View available spots for each event

## Requirements

### Backend (GraphQL) Requirements

1. **Add Registration Mutations**
   - `registerForEvent(eventId: ID!): EventRegistrationResult!`
   - `cancelEventRegistration(eventId: ID!): EventRegistrationResult!`

2. **Business Logic**
   - Prevent registration when event is at capacity
   - Prevent duplicate registrations by the same user
   - Update `currentParticipants` count when registrations change
   - Handle concurrent registration attempts properly
   - Add proper validation and error messages

3. **Authorization**
   - Use the existing CASL permission system
   - Only authenticated users can register for events
   - Users can only cancel their own registrations
   - Add appropriate permission checks

### Frontend (React) Requirements

1. **Event Detail Page Enhancement**
   - Add registration button to `/event/$eventId` page
   - Show current registration status (registered/not registered)
   - Display available spots vs. total capacity
   - Handle different states: loading, success, error

2. **User Experience**
   - Show loading states during registration/cancellation
   - Display success/error messages clearly
   - Use optimistic updates with rollback on failure
   - Disable registration button when appropriate (full capacity, already registered)

3. **Events List Integration**
   - Show registration status indicators on the events list
   - Update the UI immediately after registration changes

### Technical Requirements

1. **Type Safety**
   - Proper TypeScript types for all new functionality
   - GraphQL schema updates with appropriate types
   - Frontend types should match GraphQL schema

2. **Error Handling**
   - Handle network errors gracefully
   - Show meaningful error messages to users
   - Implement proper error boundaries

3. **State Management**
   - Use TanStack Query for server state management
   - Implement proper cache invalidation
   - Handle optimistic updates correctly

## Deliverables

1. **Working Code**
   - All mutations and queries implemented
   - Frontend components updated with registration functionality
   - Proper error handling throughout

2. **Brief Documentation** (5-10 minutes)
   - Explain your approach to handling concurrent registrations
   - Describe how you implemented the authorization
   - Note any trade-offs or assumptions you made

## Getting Started

1. Run `bun install && bun run dev` to start the development servers
2. Explore the existing event pages at `http://localhost:5173`
3. Check the GraphQL playground at `http://localhost:4000/graphql`
4. Look at the existing schema in `apps/graphql/src/schema/index.ts`
5. The database already has sample events you can work with

## Tips

- The existing `eventParticipants` table is ready to use
- Look at existing GraphQL mutations for patterns
- The CASL permissions are defined in `libs/permissions/src/index.ts`
- TanStack Query is already configured in the frontend
- Use the existing UI components from `@testwelbi/ui` 