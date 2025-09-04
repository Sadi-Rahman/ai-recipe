import { render, screen } from '@testing-library/react';
import Home from './page';
import { ThemeProvider } from './theme-provider';

describe('Home', () => {
  it('renders the main heading', () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    const heading = screen.getByText('AI-Powered Recipe Finder');
    expect(heading).toBeInTheDocument();
  });
});
