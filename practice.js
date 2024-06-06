const { chromium } = require("playwright");

(async () => {
  // Launch a browser instance
  const browser = await chromium.launch({ headless: false }); // Set headless: true if you don't want a browser window to open
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto("https://sheets.lido.app/login");

  // Fill in the login form with invalid credentials
  await page.fill('input[name="email"]', "invalid@example.com"); // Adjust the selector as needed
  await page.fill('input[name="password"]', "invalidpassword"); // Adjust the selector as needed

  // Submit the form
  await page.click('button[type="submit"]'); // Adjust the selector as needed

  // Close the browser
  // await browser.close();
})();

// // assert alert window pops up
// await expect(page.locator(`[role="alert"]`)).toBeVisible();

// // assert error text message
// await expect(
//   page.locator(`:text("Email or password incorrect.")`)
// ).toHaveText(INVALID_CREDENTIAL_ERROR_MESSAGE);

// // assert no redirect
// await expect(page).toHaveURL(initialUrl);
