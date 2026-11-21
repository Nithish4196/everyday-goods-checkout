# Mini Checkout

A small marketplace-style checkout page with a browser test suite, built for an SDET Intern take-home. It uses plain HTML, CSS and JavaScript with no build step and no backend. Automated browser tests use Playwright.

Live demo: https://nithish4196.github.io/everyday-goods-checkout/

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Installation

```bash
npm install
npx playwright install chromium
```

## Running the Application

```bash
npm start
```

The app is served at `http://localhost:3000`.

## Running Browser Tests

Headless:

```bash
npm test
```

Headed (browser visible):

```bash
npm run test:headed
```

Open the HTML report:

```bash
npm run report
```

Results of my runs are recorded in `TEST_RESULTS.md`, with screenshots in `evidence/`.

## Project Structure

```text
├── assets/                 # Product images
│   ├── tshirt.png
│   └── tote.png
├── evidence/               # Screenshots and test report from real runs
├── tests/
│   └── checkout.spec.js    # 3 automated Playwright tests
├── index.html              # Page markup
├── styles.css              # Styles
├── app.js                  # State, render function, search filter
├── package.json
├── package-lock.json
├── playwright.config.js    # Test config, starts the static server
├── README.md
├── TEST_PLAN.md            # Risks, priorities and test cases
├── TEST_RESULTS.md         # Automated and manual results, defects
└── .gitignore              # node_modules, test-results, playwright-report
```

## Manual Test Reproduction

### Manual test 1: Empty cart, then Place Order

1. Run `npm start` and open `http://localhost:3000`.
2. In the cart, click "Remove" on "Cotton T-Shirt", then on "Canvas Tote Bag".
3. Confirm the cart shows the empty message and the order total is `₹0.00`.
4. Type a valid name in "Full name" (for example `Aarav Sharma`).
5. Click "Place Order".
6. Expected:
   - The error "Your cart is empty. Add an item to continue." appears.
   - No order confirmation is shown.
   - The name stays in the field.
7. Click "Add" on a product and confirm it returns to the cart.

### Manual test 2: Rapid double-click on Place Order

1. Reload `http://localhost:3000` so the cart is back to its initial state.
2. Type `Aarav Sharma` in "Full name".
3. Double-click "Place Order" as fast as possible.
4. Expected:
   - Exactly one confirmation is shown.
   - Exactly one reference in the format `ORD-XXXXXX`.
   - The total shown is `₹1,298.00`.
   - The Place Order button is no longer available.