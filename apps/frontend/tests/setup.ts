/**
 * Test Setup Configuration
 * 
 * This file configures the global test environment for the frontend application.
 * It sets up testing libraries, mocks, and global utilities that are available
 * across all test files.
 * 
 * Key Features:
 * - Jest DOM matchers for better assertions
 * - GraphQL mocks for consistent API testing
 * - Global test utilities and helpers
 */

import '@testing-library/jest-dom';
import './utils/mocks/graphqlMocks';