import { test, expect } from '@playwright/test';

test.describe('Login Page Test For Customer', () => {
  test('should display login form and allow customer to log in and be redirected to home page', async ({ page }) => {

    await page.goto('http://localhost:5173/login');

    await expect(page.locator('h2')).toHaveText('Welcome Back'); // check if the heading h2 is there or not

    await page.fill('#email', 'kavina@gmail.com');
    await page.fill('#password', 'hotwheels5');

    await page.click('button[type="submit"]'); // click the button with type "submit"

    await expect(page).toHaveURL(/\/customer\/home/); 

    await expect(page.locator('h1.text-4xl')).toHaveText(/Welcome, (.+)!/); 

  });

  // Invalid login 
  test('should show error message on invalid login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('#email', 'samaltman@openai.com');
    await page.fill('#password', 'password');

    await page.click('button[type="submit"]');

    await expect(page.locator('.Toastify__toast')).toContainText('Login failed. Please try again.');
  });
});