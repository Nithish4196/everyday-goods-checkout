# Mini Checkout

A minimal, single-column checkout interface with a browser test suite built for an SDET Intern take-home evaluation. Built with vanilla HTML, CSS, and JavaScript with zero build steps or runtime dependencies, accompanied by automated Playwright browser tests.

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Installation

Clone the repository and install devDependencies:

```bash
npm install
npx playwright install chromium
```

## Running the Application

Start the local static server:

```bash
npm start
```

The application is served at `http://localhost:3000`.

## Running Browser Tests

Run automated tests in headless mode:

```bash
npm test
```

Run automated tests in headed mode (with browser UI visible):

```bash
npm run test:headed
```

View the generated HTML test report:

```bash
npm run report
```

## Project Structure

```text
├── assets/                 # Product images compressed under 150 KB
│   ├── tshirt.png          # Cotton T-Shirt image asset
│   └── tote.png            # Canvas Tote Bag image asset
├── index.html              # Semantic markup for marketplace layout and forms
├── styles.css              # Dark chocolate marketplace styles, 8px spacing
├── app.js                  # Single state store, render function, search filter
├── package.json            # Scripts and devDependencies (@playwright/test, http-server)
├── playwright.config.js    # Playwright configuration with webServer integration
├── tests/
│   └── checkout.spec.js    # Playwright test suite (3 automated tests)
├── README.md               # Setup, execution instructions, and manual test guide
├── TEST_PLAN.md            # Test strategy, prioritized risks, and test matrix
├── TEST_RESULTS.md         # Automated and manual test run results and defects log
├── evidence/               # Screenshots and test output from actual test runs
└── .gitignore              # Node modules and Playwright report artifacts
```

## Manual Test Reproduction

### 1. Empty Cart Then Place Order

1. Start the application with `npm start` and open `http://localhost:3000` in a browser.
2. Under "Your Cart", click the "Remove" button on "Cotton T-Shirt".
3. Click the "Remove" button on "Canvas Tote Bag".
4. Verify the cart table disappears, replaced by the note "Your cart is empty.", and order total reflects `₹0.00`.
5. Enter a valid name in "Full name" (e.g. `Aarav Sharma`).
6. Click "Place Order".
7. Verify that:
   - An inline error alert appears above the cart: `"Your cart is empty. Add an item to continue."`
   - Focus is automatically shifted to the cart error alert (`role="alert"`).
   - No order confirmation is created.
   - Click "Add" under "Available Products" to confirm the item can be added back and the error clears.

### 2. Rapid Double-Click on Place Order

1. Refresh `http://localhost:3000` to reset state.
2. In the "Full name" field, type `Aarav Sharma`.
3. Rapidly double-click the "Place Order" button.
4. Verify that:
   - The button is disabled on the first valid submit.
   - The checkout form is replaced by exactly one confirmation section.
   - Exactly one order reference (`ORD-XXXXXX`) is generated.
   - The total displayed matches `₹1,298.00`.
