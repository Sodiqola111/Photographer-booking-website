# Photographer Portfolio & Booking Website

A premium, responsive photography portfolio and booking-request front end built with HTML5, CSS3 and vanilla JavaScript.

## Run locally
1. Keep the folder structure unchanged.
2. Add your photography images to `images/hero`, `images/portfolio`, `images/services` and `images/photographer`.
3. Open `index.html` in a browser. For best development results, use VS Code with Live Server.

## Main files
- `index.html` — complete single-page website
- `css/style.css` — responsive styling and design system
- `js/script.js` — navigation, filtering, lightbox, calendar, validation, summary and sliders

## Replace before publishing
Search for bracketed placeholders such as:
- `[PHOTOGRAPHER NAME]`
- `[PHONE NUMBER]`
- `[EMAIL ADDRESS]`
- `[LOCATION]`
- `[PRICE]`
- `[X]`
- `[CLIENT NAME]`
- `[SOCIAL MEDIA LINK]`

Do not publish sample testimonials or demo statistics as real information.

## Images
Use these expected paths:
- `images/hero/hero.jpg`
- `images/photographer/photographer.jpg`
- `images/portfolio/photo-01.jpg` through `photo-08.jpg`

The HTML will still load if images are missing, but replacing them is necessary for the intended visual result.

## Demo availability
The calendar is intentionally front-end demo data. The unavailable-date rule in `js/script.js` is only a visual demonstration and must be replaced with real availability data.

## Future backend integration
For production, connect the booking form to a backend/API and database. A typical architecture is:
1. Front end submits validated booking data to an API.
2. Server validates the request again and stores it in a database.
3. Server checks real photographer availability before accepting a date.
4. Email/SMS notifications are sent to the photographer and client.
5. A payment provider can be added after availability is confirmed.
6. An authenticated admin dashboard can manage bookings, blocked dates, packages and customer records.
7. Calendar availability can then be returned from the backend instead of demo JavaScript data.

Possible production stack choices include a small Node/PHP backend, MySQL/PostgreSQL, an email provider, and a payment gateway appropriate to the photographer's market.

## Accessibility & performance
The project uses semantic sections, labelled controls, keyboard-friendly lightbox navigation, focus styles, responsive layouts and lazy loading for non-critical images.
