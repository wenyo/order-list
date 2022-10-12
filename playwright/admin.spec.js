import { test, expect } from '@playwright/test';

const admin = {
  account: 'wenda897436@gmail.com',
  password: '123456',
};

const sampleItem = {
  normal: {
    name: 'test',
    price: '1',
    stock: '0',
  },
  error: {
    name: '',
    price: '0',
    stock: '-1',
  },
};

const ERROR_MSG = {
  LOGIN_FAILED: 'login failed',
  IS_REQUIRED: 'this field is required',
  AT_LEAST_ONE: 'at least 1',
  AT_LEAST_ZERO: 'at least 0',
  NEED_INTEGER: 'should be Integer',
  UNDERSTOCK: 'understock',
};

async function userLogin(user, page, baseURL) {
  // login
  const accountInput = page.locator('input[name="account"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');

  page.fill('input[name="account"]', user.account);
  await expect(accountInput).toHaveValue(user.account);
  page.fill('input[name="password"]', user.password);
  await expect(passwordInput).toHaveValue(user.password);
  await submitButton.click();

  // login success & chek url
  await expect(page).toHaveURL(baseURL);
}

test('admin update items error msg', async ({ page, baseURL }) => {
  // go web
  await page.goto('/');
  await expect(page).toHaveURL(/.*login/);

  // login
  await userLogin(admin, page, baseURL);

  // update check
  await page.locator('.item:first-child .update').click();
  const nameInput = page.locator('.alert-form .name input');
  const nameError = page.locator('.alert-form .name .error-msg');
  const priceInput = page.locator('.alert-form .price input');
  const priceError = page.locator('.alert-form .price .error-msg');
  const stockInput = page.locator('.alert-form .stock input');
  const stockError = page.locator('.alert-form .stock .error-msg');
  const submitButton = page.locator('.alert-form button[type="submit"]');

  // clear input
  await nameInput.fill(sampleItem.error.name);
  await nameInput.press('Tab');
  await expect(nameError).toHaveText(ERROR_MSG.IS_REQUIRED);
  await expect(submitButton).toBeDisabled();
  // reset status
  await nameInput.fill(sampleItem.normal.name);
  await nameInput.press('Tab');
  await expect(submitButton).toBeEnabled();

  // clear input
  await priceInput.fill(sampleItem.error.price);
  await priceInput.press('Tab');
  await expect(priceError).toHaveText(ERROR_MSG.AT_LEAST_ONE);
  await expect(submitButton).toBeDisabled();
  // reset status
  await priceInput.fill(sampleItem.normal.price);
  await nameInput.press('Tab');
  await expect(submitButton).toBeEnabled();

  // clear input
  await stockInput.fill(sampleItem.error.stock);
  await stockInput.press('Tab');
  await expect(stockError).toHaveText(ERROR_MSG.AT_LEAST_ZERO);
  await expect(submitButton).toBeDisabled();
  // reset status
  await stockInput.fill(sampleItem.normal.stock);
  await nameInput.press('Tab');
  await expect(submitButton).toBeEnabled();
});
