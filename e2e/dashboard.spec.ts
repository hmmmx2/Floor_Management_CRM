import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alwintay@floodmanagement.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  });

  test('should display dashboard with KPI cards', async ({ page }) => {
    await expect(page.getByText(/Dashboard/i)).toBeVisible();
    await expect(page.getByText(/Total Nodes/i)).toBeVisible();
    await expect(page.getByText(/Water Level Status/i)).toBeVisible();
  });

  test('should display sensor table', async ({ page }) => {
    await expect(page.getByText(/Node ID/i)).toBeVisible();
    await expect(page.getByText(/Water Level/i)).toBeVisible();
  });

  test('should display map component', async ({ page }) => {
    // Map should be visible (either Google Maps or placeholder)
    const mapContainer = page.locator('[class*="map"], [id*="map"]').first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('should show live data indicator', async ({ page }) => {
    // Should show "Live" or "Updated" indicator
    await expect(
      page.getByText(/Live|Updated|Paused/i).first()
    ).toBeVisible({ timeout: 10000 });
  });
});

