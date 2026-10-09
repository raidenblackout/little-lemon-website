import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

function renderAt(path) {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
  return user;
}

describe('App', () => {
  it('renders the home page landmarks and sections', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Little Lemon' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /this week's specials/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /testimonials/i })).toBeInTheDocument();
  });

  it('provides a skip link to the main content', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main-content'
    );
  });

  it('gives every image alternative text (or marks it decorative)', () => {
    renderAt('/');
    document.querySelectorAll('img').forEach((img) => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  it('navigates to the booking page from the hero call to action', async () => {
    const user = renderAt('/');
    const hero = screen.getByRole('region', { name: 'Little Lemon' });
    await user.click(within(hero).getByRole('link', { name: /reserve a table/i }));
    expect(
      await screen.findByRole('heading', { level: 1, name: /reserve a table/i })
    ).toBeInTheDocument();
    expect(document.title).toBe('Reserve a Table | Little Lemon');
  });

  it('marks the current page in the main navigation', () => {
    renderAt('/booking');
    const mainNav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(mainNav).getByRole('link', { name: 'Reservations' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('toggles the mobile menu and reports its state', async () => {
    const user = renderAt('/');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'primary-navigation');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName(/close menu/i);

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows a 404 page for unknown routes', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
