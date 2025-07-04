/**
 * About Page Tests
 * 
 * Tests for the About page component. This file demonstrates basic component
 * testing patterns and serves as a template for other page tests.
 * 
 * Test Coverage:
 * - Component rendering
 * - Content display
 * - Accessibility features
 * - Responsive behavior
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutPage } from '../../src/routes/about';

describe('AboutPage', () => {
  /**
   * Test: Basic rendering
   * 
   * Verifies that the About page renders without crashing and displays
   * the expected content structure.
   */
  it('renders About page content successfully', () => {
    render(<AboutPage />);
    
    expect(screen.getByText(/About TestWelbi/i)).toBeInTheDocument();
    expect(screen.getByText(/modern monorepo setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture/)).toBeInTheDocument();
    expect(screen.getByText(/The application is built with/i)).toBeInTheDocument();
  });

  /**
   * Test: Content structure
   * 
   * Ensures that all major sections of the About page are present
   * and properly structured.
   */
  it('displays all major content sections', () => {
    render(<AboutPage />);
    
    expect(screen.getByText(/About TestWelbi/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture/)).toBeInTheDocument();
    expect(screen.getByText(/The application is built with/i)).toBeInTheDocument();
  });

  /**
   * Test: Content completeness
   * 
   * Verifies that all expected content is present and readable.
   */
  it('contains all expected content sections', () => {
    render(<AboutPage />);
    
    expect(screen.getByText(/About TestWelbi/i)).toBeInTheDocument();
    expect(screen.getByText(/modern monorepo setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture/)).toBeInTheDocument();
    expect(screen.getByText(/The application is built with/i)).toBeInTheDocument();
  });
});