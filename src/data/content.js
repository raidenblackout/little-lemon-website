import greekSalad from '../assets/greek-salad.svg';
import bruschetta from '../assets/bruschetta.svg';
import lemonDessert from '../assets/lemon-dessert.svg';

export const RESTAURANT = {
  name: 'Little Lemon',
  city: 'Chicago',
  address: '678 Pisa Ave, Chicago, IL 60611',
  phone: '(312) 593-2744',
  phoneHref: 'tel:+13125932744',
  email: 'contact@littlelemon.com',
  hours: [
    { days: 'Mon – Fri', time: '2:00 pm – 10:00 pm' },
    { days: 'Sat – Sun', time: '12:00 pm – 11:00 pm' },
  ],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Menu', to: '/#specials' },
  { label: 'Reservations', to: '/booking' },
  { label: 'Order Online', to: '/order-online' },
  { label: 'Login', to: '/login' },
];

export const SPECIALS = [
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    price: 12.99,
    image: greekSalad,
    alt: 'Greek salad with tomatoes, cucumber, feta cheese and black olives',
    description:
      'The famous Greek salad of crispy lettuce, peppers, olives and our Chicago-style feta cheese, garnished with crunchy garlic and rosemary croutons.',
  },
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    price: 5.99,
    image: bruschetta,
    alt: 'Two slices of grilled bread topped with diced tomato and basil',
    description:
      'Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.',
  },
  {
    id: 'lemon-dessert',
    name: 'Lemon Dessert',
    price: 5.0,
    image: lemonDessert,
    alt: 'Slice of layered lemon cake with a lemon wedge on top',
    description:
      "This comes straight from grandma's recipe book. Every last ingredient has been sourced and is as authentic as can be imagined.",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sara L.',
    rating: 5,
    review: 'The Greek salad tastes just like the one I had in Athens. Lovely staff, too!',
  },
  {
    id: 2,
    name: 'Tilly R.',
    rating: 4,
    review: 'Cozy atmosphere and the lemon dessert is a must. Booking online was effortless.',
  },
  {
    id: 3,
    name: 'Daniel K.',
    rating: 5,
    review: 'We celebrated our anniversary here. Mario and Adrian made it unforgettable.',
  },
  {
    id: 4,
    name: 'Priya M.',
    rating: 5,
    review: 'Fresh ingredients, fair prices and the best bruschetta in Chicago.',
  },
];

export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
