import Nav from './Nav';
import logoLight from '../assets/logo-light.svg';
import { RESTAURANT } from '../data/content';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com' },
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'X (Twitter)', href: 'https://x.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <img
          src={logoLight}
          alt="Little Lemon"
          className="site-footer__logo"
          width="96"
          height="120"
          loading="lazy"
        />

        <section aria-labelledby="footer-nav-heading">
          <h2 id="footer-nav-heading" className="site-footer__heading">
            Doormat Navigation
          </h2>
          <Nav label="Footer" className="nav nav--footer" />
        </section>

        <section aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading" className="site-footer__heading">
            Contact
          </h2>
          <address className="site-footer__address">
            {RESTAURANT.address}
            <br />
            <a href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a>
            <br />
            <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
          </address>
          <ul className="site-footer__hours">
            {RESTAURANT.hours.map((slot) => (
              <li key={slot.days}>
                <span>{slot.days}:</span> {slot.time}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-social-heading">
          <h2 id="footer-social-heading" className="site-footer__heading">
            Social Media Links
          </h2>
          <ul className="site-footer__list">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="site-footer__copyright">
        &copy; {year} {RESTAURANT.name}, {RESTAURANT.city}. All rights reserved.
      </p>
    </footer>
  );
}
