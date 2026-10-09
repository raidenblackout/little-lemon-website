import { Link } from 'react-router-dom';
import heroDish from '../assets/hero-dish.svg';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-heading" className="display-title">
            Little Lemon
          </h1>
          <p className="subtitle">Chicago</p>
          <p className="lead">
            We are a family owned Mediterranean restaurant, focused on traditional recipes
            served with a modern twist.
          </p>
          <Link to="/booking" className="button button--primary">
            Reserve a Table
          </Link>
        </div>
        <img
          className="hero__image"
          src={heroDish}
          alt="Chef's platter of bruschetta with fresh tomatoes, basil and a lemon wedge"
          width="400"
          height="480"
        />
      </div>
    </section>
  );
}
