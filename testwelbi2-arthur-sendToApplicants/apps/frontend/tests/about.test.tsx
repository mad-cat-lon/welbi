import { render, screen } from '@testing-library/react';
import { AboutPage } from '../src/routes/about';

test('renders About page content', () => {
  render(<AboutPage />);
  expect(screen.getByText(/About TestWelbi/i)).toBeInTheDocument();
  expect(screen.getByText(/modern monorepo setup/i)).toBeInTheDocument();
  expect(screen.getByText(/Architecture/)).toBeInTheDocument();
  expect(screen.getByText(/The application is built with/i)).toBeInTheDocument();
});