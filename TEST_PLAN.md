# Test Plan: Mini Checkout

## 1. Scope

### In Scope
- Cart item lifecycle: incrementing quantity, decrementing quantity, removing items, and adding items back from the catalog.
- Price calculations: line items (`price * quantity`) and order total derived from a single state render function, formatted in Indian Rupee (`en-IN`).
- Field validation: empty cart validation and blank/whitespace-only customer name validation with inline `role="alert"` error messages.
- Error focus management: shifting focus to the first invalid control or alert on submission failure.
- Submission integrity: double-submit prevention disabling redundant submissions (rapid double-click, Enter key) and ensuring single order confirmation generation.
- Accessibility: semantic HTML, `aria-live` announcements on dynamic totals and errors, visible keyboard focus indicators, and WCAG AA contrast.
- Automated browser testing via Playwright and documented manual test procedures.

### Out of Scope
- Backend order processing, database persistence, and payment gateway integrations.
- Multi-currency conversions and international tax calculations.
- Session persistence (`localStorage`, `sessionStorage`, cookies).
- User authentication and saved customer profiles.

## 2. Risk Assessment (Ranked by Priority)

| Priority | Risk | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **P1** | **Wrong total / calculation divergence** | Overcharging or undercharging customer; financial discrepancy. | Single source of truth in `state.cart`; line totals and order totals derived centrally in `render()` without duplicated math. |
| **P2** | **Checkout allowed with invalid state** | Incomplete orders (blank customer name) or zero-value orders (empty cart). | Inline validation guard in `handleSubmit()` verifying trimmed name and cart length before setting `placed = true`. |
| **P3** | **Duplicate order creation on double-click** | Multiple charges or duplicate inventory reservations created by rapid clicking or double Enter key presses. | Immediate `state.placed = true` flag guard, button `disabled = true`, and replacing the form DOM on first valid submit. |
| **P4** | **Lost user input on validation failure** | Customer frustration if typed text or customized quantities are wiped out on validation errors. | State preservation ensures `state.name` and `state.cart` remain intact during validation renders. |
| **P5** | **Unclear or inaccessible error messaging** | Users unable to identify why checkout failed, particularly screen reader users. | Inline `role="alert"` messages with `aria-describedby` and automatic focus shifting to the first problem element. |

## 3. Test Cases Matrix

| Test ID | Title | Steps | Expected Result | Type | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Successful checkout | 1. Navigate to `/`<br>2. Fill name with `Aarav Sharma`<br>3. Click "Place Order" | Form replaced by confirmation container; confirmation is visible; reference matches `/^ORD-[A-Z0-9]{6}$/`; customer name and total `₹1,298.00` are displayed. | Automated | P1 |
| **TC-02** | Blank name validation | 1. Navigate to `/`<br>2. Leave name empty<br>3. Click "Place Order" | Error alert displayed with exact text: `"Enter your full name to place the order."`; no confirmation element exists in DOM; cart rows and total remain intact; focus moves to name input. | Automated | P1 |
| **TC-03** | Quantity adjustment & total recalculation | 1. Navigate to `/`<br>2. Click `+` button on T-Shirt twice | T-Shirt quantity updates to 3; line total updates to `₹2,397.00`; order total updates to `₹2,896.00`. | Automated | P1 |
| **TC-04** | Empty cart validation | 1. Navigate to `/`<br>2. Remove both items from cart<br>3. Fill name with `Aarav Sharma`<br>4. Click "Place Order" | Cart error alert displayed with text: `"Your cart is empty. Add an item to continue."`; focus shifts to cart error alert; order submission halted. | Manual | P1 |
| **TC-05** | Rapid double-click submission | 1. Navigate to `/`<br>2. Fill name with `Aarav Sharma`<br>3. Rapidly double-click "Place Order" | First click submits; button disabled; second click ignored; exactly one confirmation box and one unique reference created. | Manual | P1 |
| **TC-06** | Add item back after removal | 1. Navigate to `/`<br>2. Click "Remove" on Cotton T-Shirt<br>3. Click "Add" under Available Products | Cotton T-Shirt row reappears in cart with quantity 1; order total recalculates to `₹1,298.00`; cart error clears if previously shown. | Manual | P2 |
| **TC-07** | Quantity minimum boundary | 1. Navigate to `/`<br>2. Inspect `-` button on item with quantity 1 | `-` button has `disabled` attribute; clicking does not decrement below 1. | Manual | P2 |
| **TC-08** | Quantity maximum boundary | 1. Navigate to `/`<br>2. Increment item quantity to 10 | `+` button becomes `disabled` at quantity 10; clicking does not increment past 10. | Manual | P2 |
| **TC-09** | Whitespace-only name validation | 1. Navigate to `/`<br>2. Enter `"   "` in name input<br>3. Click "Place Order" | Validation rejects submission; shows `"Enter your full name to place the order."`; original whitespace preserved in input without wipeout. | Manual | P2 |

## 4. Test Environment

- **Operating System:** Windows 11 Pro / Windows Server x64
- **Runtime:** Node.js v24.2.0
- **Browser Harness:** Playwright 1.49.0
- **Test Browsers:** Chromium (Headless Shell and Headed Desktop Chrome)
- **Local Server:** http-server v14.1.1 on `http://localhost:3000`
