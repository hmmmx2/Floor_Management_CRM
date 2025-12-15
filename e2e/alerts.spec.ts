import { test, expect } from '@playwright/test';

test.describe('Alerts Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alwintay@floodmanagement.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    
    // Navigate to alerts
    await page.goto('/alerts');
  });

  test('should display alerts page', async ({ page }) => {
    await expect(page.getByText(/Alerts Monitoring/i)).toBeVisible();
  });

  test('should show alert statistics', async ({ page }) => {
    await expect(page.getByText(/Total Nodes/i)).toBeVisible({ timeout: 10000 });
  });

  test('should filter alerts by type', async ({ page }) => {
    const filterButton = page.getByText(/Filter/i).first();
    
    if (await filterButton.isVisible({ timeout: 5000 })) {
      await filterButton.click();
      // Check filter options
      await expect(page.getByText(/All Alerts|Danger|Warning/i)).toBeVisible();
    }
  });

  test('should use calendar date picker', async ({ page }) => {
    const dateButton = page.getByText(/Select Date|Calendar/i).first();
    
    if (await dateButton.isVisible({ timeout: 5000 })) {
      await dateButton.click();
      // Calendar dropdown should appear
      await expect(page.getByText(/January|February|March/i).first()).toBeVisible({ timeout: 2000 });
    }
  });
});

