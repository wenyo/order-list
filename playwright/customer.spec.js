import { test, expect } from '@playwright/test';

const customer = {
  account: 'wen.you0303666@gmail.com',
  password: '123456',
};
const nowTime = new Date().getTime();
const sampleItem = {
  normal: {
    count: '1',
    note: `normal-${nowTime}`,
  },
  error: {
    count: '0',
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

async function userLogout(page) {
  await page.locator('.menu-box .icon-menu').click();
  await page.locator('.logout').click();
  await expect(page).toHaveURL(/.*login/);
}

test('customer add order error msg', async ({ page, baseURL }) => {
  // go web
  await page.goto('/');
  await expect(page).toHaveURL(/.*login/);

  // login
  await userLogin(customer, page, baseURL);

  // update check
  await page.locator('.item:first-child .buy').click();
  const countInput = page.locator('.alert-form .count input');
  const countError = page.locator('.alert-form .count .error-msg');
  const submitButton = page.locator('.alert-form button[type="submit"]');

  // clear input
  await countInput.fill(sampleItem.error.count);
  await countInput.press('Tab');
  await expect(countError).toHaveText(ERROR_MSG.AT_LEAST_ONE);
  await expect(submitButton).toBeDisabled();
  // reset status
  await countInput.fill(sampleItem.normal.count);
  await countInput.press('Tab');
  await expect(submitButton).toBeEnabled();

  // close alert
  await page.locator('.alert-block i.icon-close').click();

  // logout
  await userLogout(page);
});

test('customer edit order error msg', async ({ page, baseURL }) => {
  // go web
  await page.goto('/');
  await expect(page).toHaveURL(/.*login/);

  // login
  await userLogin(customer, page, baseURL);

  // add new order
  await page.locator('.item:first-child .buy').click();
  await page.locator('.alert-form .count input').fill(sampleItem.normal.count);
  await page.locator('.alert-form .note textarea').fill(sampleItem.normal.note);
  await page.locator('.alert-form button[type="submit"]').click();

  // go list
  await page.locator('.menu-box .icon-menu').click();
  await page.locator('.router :nth-child(2)').click();
  await expect(page).toHaveURL(/.*list/);

  // check order
  const id = await page
    .locator(`xpath=//li[contains(.,'${sampleItem.normal.note}')]`)
    .getAttribute('data-id');
  const liEl = page.locator(`xpath=//li[@data-id='${id}']`);
  await expect(liEl).toBeVisible();

  // test error
  await liEl.click();
  const countInput = page.locator('.alert-form .count input');
  const countError = page.locator('.alert-form .count .error-msg');
  const submitButton = page.locator('.alert-form button[type="submit"]');

  // clear input
  await countInput.fill(sampleItem.error.count);
  await countInput.press('Tab');
  await expect(countError).toHaveText(ERROR_MSG.AT_LEAST_ONE);
  await expect(submitButton).toBeDisabled();
  // reset status
  await countInput.fill(sampleItem.normal.count);
  await countInput.press('Tab');
  await expect(submitButton).toBeEnabled();

  // close alert
  await page.locator('.alert-block i.icon-close').click();

  // logout
  await userLogout(page);
});
