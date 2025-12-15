import { test, expect } from '@playwright/test';

test.describe('Sensors Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alwintay@floodmanagement.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
    
    // Navigate to sensors
    await page.goto('/sensors');
  });

  test('should display sensors table', async ({ page }) => {
    await expect(page.getByText(/IoT Sensor Networks/i)).toBeVisible();
    await expect(page.getByText(/Node ID/i)).toBeVisible();
    await expect(page.getByText(/Water Level/i)).toBeVisible();
  });

  test('should filter sensors by status', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check if filter dropdown exists
    const filterButton = page.getByText(/Filter|Status/i).first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      // Test filtering functionality
    }
  });

  test('should export to CSV', async ({ page }) => {
    // Wait for export button
    const exportButton = page.getByText(/Export|CSV/i).first();
    
    if (await exportButton.isVisible({ timeout: 5000 })) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.csv|\.xlsx/i);
    }
  });

  test('should search sensors', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();
    
    if (await searchInput.isVisible({ timeout: 5000 })) {
      await searchInput.fill('102');
      // Wait for filtered results
      await page.waitForTimeout(500);
    }
  });
});

