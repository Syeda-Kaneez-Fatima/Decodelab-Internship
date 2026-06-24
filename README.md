# Decodelab-Internship

# Image Galaxy — Interactive Image Gallery

**DecodeLabs Frontend Development Internship · Batch 2026**
*Projects 1–3 | Static Webpage Design → Responsive Layout → Interactive Web Elements*

---

## Live Demo

👉 [Click here to view the live project](https://syeda-kaneez-fatima.github.io/Decodelab-Internship/)

---

## Project Overview

This project is part of the DecodeLabs Industrial Training Kit — Projects 1, 2, and 3, combined into a single deliverable: a fully responsive, interactive image gallery built entirely with HTML, CSS, and vanilla JavaScript.

The build progresses through three phases of the training track:

- Project 1 — Static Webpage Design: semantic HTML structure and clean CSS-based layout
- Project 2 — Responsive Web Layout: mobile-first, fluid design that adapts across all screen sizes
- Project 3 — Interactive Web Elements: JavaScript-powered search, filtering, and a fully interactive lightbox

The focus throughout is on:

- Semantic Integrity — using the correct HTML element for the correct purpose
- Fluidity — a layout that looks intentional on any device, not just desktop
- User Experience — instant, real-time feedback for every interaction
- Clean Architecture — structure, style, and behavior kept fully separate

---

## Project Structure

```
image-galaxy/
│
├── index.html       # Semantic HTML structure
├── style.css        # All styling, responsive design & theming
├── script.js        # All interactivity, DOM manipulation & state logic
└── README.md        # Project documentation
```

---

## Tech Stack

- HTML5 — Semantic elements (`header`, `nav`, `main`, `footer`, `section`)
- CSS3 — Custom properties, Grid, Flexbox, `clamp()`, media queries, transitions
- Vanilla JavaScript — DOM manipulation, event handling, state management
- Google Fonts — Poppins typeface

No external libraries or frameworks were used. All logic is written from scratch.

---

## Feature Breakdown

## Project 1 — Static Webpage Design

| Area             | Implementation |

| Document outline | A single `<h1>` with a clean heading hierarchy — no skipped levels |
| Landmarks        | `<header>`, `<nav>`, `<main>`, `<footer>` in place of generic `<div>` containers |
| Layout system    | CSS Grid for the page-level structure, Flexbox for component alignment |
| Styling          | All styles live in an external stylesheet — zero inline `style=""` |
| Images           | Explicit `width`/`height` on every image to prevent layout shift |

## Project 2 — Responsive Web Layout

| Area          | Implementation |

| Viewport      | Proper `<meta name="viewport">` tag, pinch-zoom never disabled |
| Approach      | Mobile-first CSS, enhanced at `480px`, `768px`, and `1024px` breakpoints |
| Fluid units   | `clamp()`, `vw`, `rem`, and `%` instead of fixed pixel-only sizing |
| Navigation    | Hamburger-style toggle collapses search & filters into a popover panel on small screens |
| Touch targets | All interactive controls meet a 44×44px minimum tap area |

## Project 3 — Interactive Web Elements

| Area             | Implementation |

| Search & filter  | Real-time filtering by category and live text search |
| Lightbox         | Full-size image preview with next/previous navigation and keyboard support |
| DOM updates      | Built with `createElement` + `textContent` for safe, dynamic rendering |
| State management | `const`/`let` used throughout — no `var` |
| Visual state     | `classList.toggle()` drives active filters, open nav, and lightbox visibility |

---

## How to Run Locally

No setup needed — just open in browser.

```bash
# Option 1: Just open in browser
Double-click index.html

# Option 2: Clone the repo
git clone https://github.com/Syeda-Kaneez-Fatima/image-galaxy.git
cd image-galaxy
# Open index.html in any browser
```

---

## Key Concepts Demonstrated

- Semantic HTML — using elements for their intended meaning
- CSS Grid & Flexbox — macro layout vs. micro alignment
- Mobile-First Responsive Design — fluid units, `clamp()`, breakpoints
- DOM Manipulation — dynamic rendering, event-driven UI updates
- Event Handling — `click`, `input`, `keydown` for interactive feedback
- State Management — tracking filters, search terms, and lightbox position
- Accessibility — keyboard-operable controls, labeled inputs, descriptive alt text

---

## Author

Syeda Fatima
Frontend Development Intern @ DecodeLabs
GitHub: [@Syeda-Kaneez-Fatima](https://github.com/Syeda-Kaneez-Fatima)

---

## License

This project was built as part of an internship training program at DecodeLabs.
© 2026 DecodeLabs · All rights reserved.
