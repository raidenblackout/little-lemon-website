import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <section className="section" aria-labelledby="not-found-heading">
      <div className="container container--narrow">
        <h1 id="not-found-heading" className="section-title">
          Page not found
        </h1>
        <p>Sorry, we couldn&apos;t find the page you were looking for.</p>
        <Link to="/" className="button button--primary">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
