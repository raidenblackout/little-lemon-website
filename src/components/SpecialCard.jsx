import { Link } from 'react-router-dom';
import { formatPrice } from '../data/content';

export default function SpecialCard({ dish }) {
  const headingId = `special-${dish.id}`;

  return (
    <article className="card" aria-labelledby={headingId}>
      <img
        className="card__image"
        src={dish.image}
        alt={dish.alt}
        width="400"
        height="260"
        loading="lazy"
      />
      <div className="card__body">
        <div className="card__header">
          <h3 id={headingId} className="card__title">
            {dish.name}
          </h3>
          <p className="card__price">
            <span className="visually-hidden">Price: </span>
            {formatPrice(dish.price)}
          </p>
        </div>
        <p className="card__description">{dish.description}</p>
        <Link to="/order-online" className="card__link">
          Order a delivery<span className="visually-hidden"> of {dish.name}</span>
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </article>
  );
}
