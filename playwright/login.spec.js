import { test, expect } from '@playwright/test';

const ERROR_MSG = {
  LOGIN_FAILED: 'login failed',
  IS_REQUIRED: 'this field is required',
  AT_LEAST_ONE: 'at least 1',
  AT_LEAST_ZERO: 'at least 0',
  NEED_INTEGER: 'should be Integer',
  UNDERSTOCK: 'understock',
};

const errorSample = {
  account: 'error@gmail.com',
  password: '123456',
};

test('login failed error msg test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/.*login/);

  const accountInput = page.locator('input[name="account"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');

  page.fill('input[name="account"]', errorSample.account);
  await expect(accountInput).toHaveValue(errorSample.account);
  page.fill('input[name="password"]', errorSample.password);
  await expect(passwordInput).toHaveValue(errorSample.password);

  await submitButton.click();

  await expect(page.locator('.btn-block .error-msg')).toHaveText(ERROR_MSG.LOGIN_FAILED);
});

test('login input required', async ({ page }) => {
  await page.goto('/');

  const accountInput = page.locator('input[name="account"]');
  const accountError = page.locator('.account .error-msg');
  const passwordInput = page.locator('input[name="password"]');
  const passwordError = page.locator('.password .error-msg');
  const submitButton = page.locator('button[type="submit"]');

  await accountInput.click();
  await accountInput.press('Tab');

  await expect(accountError).toHaveText(ERROR_MSG.IS_REQUIRED);
  await expect(submitButton).toBeDisabled();

  await passwordInput.click();
  await passwordInput.press('Tab');

  await expect(passwordError).toHaveText(ERROR_MSG.IS_REQUIRED);
  await expect(submitButton).toBeDisabled();

  await accountInput.fill(errorSample.account);
  await passwordInput.fill(errorSample.password);
  await passwordInput.press('Tab');
  await expect(submitButton).toBeEnabled();
});
