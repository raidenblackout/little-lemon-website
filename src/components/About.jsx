import chefs from '../assets/chefs.svg';
import restaurant from '../assets/restaurant.svg';

export default function About() {
  return (
    <section id="about" className="section about" aria-label="About Little Lemon">
      <div className="container about__inner">
        <div className="about__text">
          <h2 className="display-title display-title--dark">
            Little Lemon
          </h2>
          <p className="subtitle subtitle--dark">Chicago</p>
          <p>
            Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved to the
            United States to pursue their shared dream of owning a restaurant.
          </p>
          <p>
            To craft the menu, Mario relies on family recipes and his experience as a chef in
            Italy. Adrian does all the marketing for the restaurant and led the effort to expand
            the menu beyond classic Italian to incorporate additional cuisines from the
            Mediterranean region.
          </p>
        </div>
        <div className="about__images">
          <img
            className="about__image about__image--back"
            src={restaurant}
            alt="The warmly lit Little Lemon dining room"
            width="300"
            height="360"
            loading="lazy"
          />
          <img
            className="about__image about__image--front"
            src={chefs}
            alt="Owners Mario and Adrian in their chef whites"
            width="300"
            height="360"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
