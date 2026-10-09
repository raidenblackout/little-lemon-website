import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/content';

export default function Nav({ label, className = '' }) {
  const { pathname, hash } = useLocation();
  const current = `${pathname}${hash}`;

  return (
    <nav aria-label={label} className={className}>
      <ul>
        {NAV_LINKS.map((link) => {
          const isCurrent = current === link.to;
          return (
            <li key={link.to}>
              <Link to={link.to} aria-current={isCurrent ? 'page' : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
