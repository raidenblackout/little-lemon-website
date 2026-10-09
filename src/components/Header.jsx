import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Nav from './Nav';
import logo from '../assets/logo.svg';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Little Lemon home">
          <img src={logo} alt="" width="165" height="45" />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__bar" aria-hidden="true" />
          <span className="menu-toggle__bar" aria-hidden="true" />
          <span className="menu-toggle__bar" aria-hidden="true" />
        </button>

        <div
          id="primary-navigation"
          className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}
        >
          <Nav label="Main" className="nav nav--primary" />
        </div>
      </div>
    </header>
  );
}
