# Little Lemon — Table Booking Web App

A responsive, accessible React web app for **Little Lemon**, a family-owned Mediterranean
restaurant in Chicago. Built as the capstone project for the Meta Front-End Developer
course. The main feature is a **table reservation form** with real-time validation, clear
error messages and a confirmation page.

---

## Features

- **Home page** following the Little Lemon UX/UI design: hero with call to action, "This
  week's specials" cards, testimonials, an About section and a footer with doormat navigation.
- **Booking page** (`/booking`) with a validated reservation form:
  - date, time, number of guests, occasion, name, email, phone and special requests
  - available times update when the date changes (`useReducer` + mock `fetchAPI`)
  - inline, human-readable error messages plus an error summary on submit
  - handles API rejection and network failure with meaningful messages
- **Confirmation page** (`/confirmed`) summarising the booking. It also handles a direct
  visit or a page refresh, when there's no booking data to show.
- **404 page** and "coming soon" placeholders for Order Online and Login.
- **Responsive**, mobile-first layout with a collapsible hamburger menu.
- **87 unit and integration tests** (Vitest + React Testing Library).

## Tech stack

| Area      | Tool                                         |
| --------- | -------------------------------------------- |
| UI        | React 18, React Router 7                     |
| Build/dev | Vite                                         |
| Testing   | Vitest, React Testing Library, jsdom         |
| Styling   | Plain CSS with design tokens (CSS variables) |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) **20.19+ or 22.12+** (includes npm)
- Git

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "Little Lemon Website"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

### Available scripts

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the dev server with hot reload            |
| `npm start`          | Alias for `npm run dev`                         |
| `npm test`           | Run the whole test suite once                   |
| `npm run test:watch` | Re-run tests on every file change               |
| `npm run build`      | Create an optimised production build in `dist/` |
| `npm run preview`    | Serve the production build locally              |

---

## Project structure

```
Little Lemon Website/
├── index.html              # HTML shell: meta tags, fonts, root element
├── public/                 # Static files served as-is (favicon)
└── src/
    ├── main.jsx            # Entry point: mounts <App> inside <BrowserRouter>
    ├── App.jsx             # Layout (skip link, header, main, footer) and routes
    ├── api/
    │   └── api.js          # Mock booking API: fetchAPI(date), submitAPI(formData)
    ├── assets/             # Logo and dish illustrations (SVG)
    ├── components/         # Reusable UI pieces
    │   ├── BookingForm.jsx # Reservation form: fields, validation display, submit
    │   ├── Header.jsx      # Logo + responsive navigation
    │   ├── Nav.jsx         # Nav list shared by header and footer
    │   ├── Hero.jsx, Specials.jsx, SpecialCard.jsx, Testimonials.jsx, About.jsx
    │   ├── Footer.jsx
    │   └── ScrollManager.jsx  # Scrolls to top / to #hash on navigation
    ├── data/
    │   └── content.js      # Menu items, testimonials, restaurant details
    ├── hooks/
    │   └── useDocumentTitle.js
    ├── pages/              # One component per route
    │   ├── HomePage.jsx
    │   ├── BookingPage.jsx      # Owns available-times state and the submit flow
    │   ├── ConfirmedBooking.jsx
    │   ├── ComingSoon.jsx
    │   └── NotFound.jsx
    ├── styles/
    │   └── index.css       # Global styles and brand design tokens
    ├── utils/
    │   ├── dates.js        # Timezone-safe date parsing/formatting
    │   ├── timesReducer.js # initializeTimes / updateTimes reducer
    │   └── validation.js   # validateBooking(): all form rules in one place
    └── __tests__/          # Unit and integration tests
```

**Design decisions**

- **Logic is kept out of components.** Validation, the times reducer and date helpers are
  plain functions, so they're easy to test and reuse.
- **`BookingPage` holds state and `BookingForm` renders it.** The page owns the available
  times and the API call, and the form receives them as props.
- **Content is data.** Menu items and testimonials live in `src/data/content.js`, so you can
  edit the copy without touching layout code.

---

## Booking form validation

All rules live in [`src/utils/validation.js`](src/utils/validation.js) (`BOOKING_RULES`).

| Field            | Rules                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| Date             | Required, a real calendar date, not in the past, at most 90 days ahead    |
| Time             | Required, must be one of the available slots for the chosen date          |
| Guests           | Required whole number from 1 to 10 (larger parties are asked to call)    |
| Occasion         | Optional; must be one of Birthday / Anniversary / Business / Other        |
| Name             | Required, 2–50 characters, letters, spaces, hyphens, apostrophes, periods |
| Email            | Required, valid format (surrounding whitespace is ignored)                |
| Phone            | Optional; if given, 7–15 digits with common separators                    |
| Special requests | Optional, at most 200 characters (live character counter)                 |

**Edge cases handled**

- **Changing the date.** The selected time is cleared and the time list is reloaded for the
  new date.
- **A fully booked date.** The time picker is disabled and a "fully booked" message appears
  right away.
- **Impossible dates** such as `2030-02-30` are rejected.
- **`YYYY-MM-DD` values** are parsed as local dates, so the chosen day doesn't shift by one
  in timezones behind UTC.
- **Values are cleaned before submitting.** Whitespace is trimmed and the guest count is
  converted to a number.
- **The booking API rejects the request or throws.** A clear message appears, and the form
  stays filled in and can be submitted again.
- **Double submission.** The submit button is disabled while a request is in progress.
- **The confirmation page is opened directly.** It shows a "No reservation found" message
  with a link back to the form.

Error messages appear after a field is left (blur) or when the user tries to submit, so
users don't see errors before they've typed anything.

---

## Accessibility

- Semantic landmarks: `<header>`, `<nav>` (labelled "Main" and "Footer"), `<main>`,
  `<section>` with `aria-labelledby`, `<article>`, `<footer>`, `<address>`.
- A **"Skip to main content"** link is the first item you reach with the keyboard.
- Every form control has a `<label>`. Related fields are grouped with
  `<fieldset>`/`<legend>`.
- Errors use `aria-invalid` and are linked to their fields with `aria-describedby`. The
  error summary uses `role="alert"`.
- When a submit fails, focus moves to the first invalid field. After a successful booking,
  focus moves to the confirmation heading.
- The mobile menu button uses `aria-expanded`/`aria-controls` and closes with **Escape**.
- `aria-current="page"` marks the active navigation link.
- Images have descriptive `alt` text. Decorative ones use `alt=""`.
- Star ratings are announced as text, for example "Rated 4 out of 5".
- Colours are checked for contrast, focus is always visible, and the site respects
  `prefers-reduced-motion`.
- Each page sets its own `document.title`.

## Responsiveness

The layout is mobile-first. It uses CSS Grid with `auto-fit`/`minmax`, fluid type with
`clamp()`, and breakpoints at 640px, 768px and 860px. At 375px wide there is no horizontal
scrolling. Below 860px the navigation collapses into a hamburger menu.

---

## Testing

```bash
npm test
```

| Test file                   | Covers                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| `api.test.js`               | Mock API output format, determinism, invalid input                     |
| `dates.test.js`             | Date parsing/formatting, impossible dates, month rollover              |
| `timesReducer.test.js`      | `initializeTimes` and `updateTimes` (valid, invalid, unknown actions)  |
| `validation.test.js`        | Every validation rule, including boundary values and edge cases        |
| `BookingForm.test.jsx`      | Labels, HTML5 attributes, dispatch on date change, submit/error flows  |
| `BookingPage.test.jsx`      | Full flow to the confirmation page; API rejection and failure messages |
| `ConfirmedBooking.test.jsx` | Booking summary, optional rows, direct visit without data              |
| `App.test.jsx`              | Landmarks, skip link, alt text, routing, `aria-current`, mobile menu   |

---

## Notes

- **Mock API.** The course provides `fetchAPI`/`submitAPI` as an external script. This
  project uses an equivalent local module (`src/api/api.js`) so the app works offline and
  the tests always give the same results.
- **Images.** The dish and restaurant pictures are lightweight SVG illustrations in
  `src/assets/`. To use the official course photos instead, add them to `src/assets/` and
  update the imports in `src/data/content.js`, `Hero.jsx` and `About.jsx`.
