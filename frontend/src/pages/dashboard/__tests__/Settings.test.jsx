import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Settings from '../Settings';

describe('Settings Component', () => {
  it('renders the settings page with the correct heading', () => {
    render(<Settings />);
    
    const headingElement = screen.getByRole('heading', { name: /admin settings/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('displays the under construction message', () => {
    render(<Settings />);
    
    const messageElement = screen.getByText(/Settings page is under construction/i);
    expect(messageElement).toBeInTheDocument();
  });
});
