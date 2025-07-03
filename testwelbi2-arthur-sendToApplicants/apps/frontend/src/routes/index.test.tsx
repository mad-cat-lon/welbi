import { render, screen } from '@testing-library/react';
import { Route } from './index';
import React from 'react';

describe('HomePage', () => {
  it('renders welcome message', () => {
    render(<Route.component />);
    expect(screen.getByText(/Welcome to TestWelbi/i)).toBeInTheDocument();
  });
}); 