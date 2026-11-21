const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('successful checkout shows confirmation with valid reference and total', async ({ page }) => {
  await page.getByTestId('name-input').fill('Aarav Sharma');
  await page.getByTestId('place-order').click();

  const confirmation = page.getByTestId('confirmation');
  await expect(confirmation).toBeVisible();
  await expect(page.getByTestId('order-reference')).toHaveText(/^ORD-[A-Z0-9]{6}$/);
  await expect(confirmation).toContainText('Aarav Sharma');
  await expect(confirmation).toContainText('₹1,298.00');
});

test('missing name displays inline error, preserves cart, and prevents order', async ({ page }) => {
  await page.getByTestId('place-order').click();

  const nameError = page.getByTestId('name-error');
  await expect(nameError).toBeVisible();
  await expect(nameError).toHaveText('Enter your full name to place the order.');
  await expect(page.getByTestId('confirmation')).toHaveCount(0);

  await expect(page.getByTestId('cart-row-tshirt')).toBeVisible();
  await expect(page.getByTestId('cart-row-tote')).toBeVisible();
  await expect(page.getByTestId('qty-tshirt')).toHaveText('1');
  await expect(page.getByTestId('qty-tote')).toHaveText('1');
  await expect(page.getByTestId('order-total')).toHaveText('₹1,298.00');
});

test('updating t-shirt quantity recalculates line total and order total', async ({ page }) => {
  const incBtn = page.getByTestId('qty-inc-tshirt');

  await incBtn.click();
  await expect(page.getByTestId('qty-tshirt')).toHaveText('2');

  await incBtn.click();
  await expect(page.getByTestId('qty-tshirt')).toHaveText('3');

  await expect(page.getByTestId('line-total-tshirt')).toHaveText('₹2,397.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹2,896.00');
});
