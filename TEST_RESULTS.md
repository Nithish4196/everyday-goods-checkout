# Test Execution Results

## 1. Automated Test Run Summary

- **Test Suite:** `tests/checkout.spec.js`
- **Runner:** Playwright `@playwright/test` v1.49.0 (Chromium)
- **Execution Date:** November 21, 2026
- **Status:** **3 of 3 Passed (100%)**
- **Duration:** 3.0 seconds

| Test Scenario | Status | Duration | Assertions Covered |
| :--- | :--- | :--- | :--- |
| **1. Successful checkout** | **PASSED** | 353 ms | Name filled, order placed, confirmation visible, reference format `/^ORD-[A-Z0-9]{6}$/` verified, customer name confirmed, and final total (`₹1,298.00`) verified. |
| **2. Missing name validation** | **PASSED** | 249 ms | Empty name submitted, inline error alert verified with exact copy (`"Enter your full name to place the order."`), confirmation count asserted as 0, and cart rows/totals verified intact. |
| **3. Quantity change & total calculation** | **PASSED** | 260 ms | T-shirt incremented from 1 to 3, intermediate quantity verified after each click, line total asserted as `₹2,397.00`, and order total asserted as `₹2,896.00`. |

The raw terminal execution log is preserved in [evidence/test-report.txt](file:///c:/projects/Fynd%20project/evidence/test-report.txt).

---

## 2. Manual Test Results

Manual exploratory and edge-case testing performed directly in the browser.

| Test Case | Steps Executed | Expected Result | Actual Result Observed | Evidence File | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Empty cart then Place Order** | 1. Clicked "Remove" on Cotton T-Shirt.<br>2. Clicked "Remove" on Canvas Tote Bag.<br>3. Cart showed empty state.<br>4. Entered full name.<br>5. Clicked "Place Order". | Submission blocked; inline alert displayed: `"Your cart is empty. Add an item to continue."`; focus placed on cart error alert; no confirmation rendered. | Cart error alert appeared immediately above empty state; focus shifted to the alert element; no confirmation created. | [evidence/04-empty-cart-error.png](file:///c:/projects/Fynd%20project/evidence/04-empty-cart-error.png) | **PASS** |
| **Rapid double-click on Place Order** | 1. Reloaded clean checkout page.<br>2. Entered `"Aarav Sharma"` in Full Name.<br>3. Performed rapid consecutive double-click on "Place Order". | Exactly one order created; button disabled on first event; second click ignored; exactly one confirmation box and reference generated. | Form transitioned cleanly to confirmation; button disabled; single confirmation card present; single reference `ORD-H7DLVK` created. | [evidence/05-order-confirmed.png](file:///c:/projects/Fynd%20project/evidence/05-order-confirmed.png) | **PASS** |

### Evaluator Observation Placeholders

For independent verification during review:

- **Evaluator Name:** `[ Evaluator to fill ]`
- **Execution Date:** `[ Date ]`
- **Browser & OS:** `[ e.g. Chrome 124 / Windows 11 ]`
- **Empty Cart Check Observation:** `[ Fill any additional observation here ]`
- **Double-Click Check Observation:** `[ Fill any additional observation here ]`
- **Additional Screenshot Reference:** `[ e.g. evidence/evaluator-check.png ]`

---

## 3. Defects Found

**None observed.**

All functional requirements, edge-case validations, state updates, double-submit protections, and accessibility controls behaved strictly as specified without regression or anomaly.

### Observations Log (For Future Reference)
- State synchronization: Derived arithmetic in `render()` consistently avoided stale state or floating-point formatting inconsistencies.
- Boundary handling: Decrement button disabling at quantity 1 prevents accidental negative or zero quantities; removal must be explicit via the "Remove" button as specified.
- Re-add workflow: Items deleted from the cart can be re-added from the Available Products section with quantity 1, clearing any active empty-cart errors.
