import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ComingSoon({ title }) {
  useDocumentTitle(title);

  return (
    <section className="section" aria-labelledby="coming-soon-heading">
      <div className="container container--narrow">
        <h1 id="coming-soon-heading" className="section-title">
          {title}
        </h1>
        <p>This feature is coming soon. In the meantime, you can reserve a table online.</p>
        <Link to="/booking" className="button button--primary">
          Reserve a Table
        </Link>
      </div>
    </section>
  );
}
