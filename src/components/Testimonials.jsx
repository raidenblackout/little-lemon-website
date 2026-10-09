import { TESTIMONIALS } from '../data/content';

const MAX_RATING = 5;

function Rating({ value }) {
  return (
    <p className="rating" role="img" aria-label={`Rated ${value} out of ${MAX_RATING}`}>
      {Array.from({ length: MAX_RATING }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < value ? 'star star--filled' : 'star'}>
          ★
        </span>
      ))}
    </p>
  );
}

export default function Testimonials() {
  return (
    <section className="section testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="section-title section-title--center">
          Testimonials
        </h2>
        <ul className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <figure className="testimonial">
                <Rating value={t.rating} />
                <div className="testimonial__person">
                  <span className="avatar" aria-hidden="true">
                    {t.name.charAt(0)}
                  </span>
                  <figcaption className="testimonial__name">{t.name}</figcaption>
                </div>
                <blockquote className="testimonial__quote">
                  <p>&ldquo;{t.review}&rdquo;</p>
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
