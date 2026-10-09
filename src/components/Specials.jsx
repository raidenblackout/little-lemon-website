import { Link } from 'react-router-dom';
import SpecialCard from './SpecialCard';
import { SPECIALS } from '../data/content';

export default function Specials() {
  return (
    <section id="specials" className="section specials" aria-labelledby="specials-heading">
      <div className="container">
        <div className="section__header">
          <h2 id="specials-heading" className="section-title">
            This week&apos;s specials!
          </h2>
          <Link to="/order-online" className="button button--primary">
            Online Menu
          </Link>
        </div>
        <div className="card-grid">
          {SPECIALS.map((dish) => (
            <SpecialCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  );
}
