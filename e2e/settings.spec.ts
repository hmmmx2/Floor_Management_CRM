import { test, expect } from '@playwright/test';

test.describe('Settings Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alwintay@floodmanagement.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  });

  test('should access Account Settings', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/Account Settings/i)).toBeVisible();
  });

  test('should update user profile', async ({ page }) => {
    await page.goto('/admin');
    
    // Find name input
    const nameInput = page.getByLabel(/Full Name|Name/i).first();
    if (await nameInput.isVisible({ timeout: 5000 })) {
      await nameInput.clear();
      await nameInput.fill('Updated Name');
      
      // Save changes
      const saveButton = page.getByText(/Save Changes/i).first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        // Should show success message
        await expect(page.getByText(/saved|success/i)).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should access CRM Settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/CRM Settings/i)).toBeVisible();
  });

  test('should configure data sync settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Click on Data Management tab
    await page.click('text=Data Management');
    
    // Check for Live Mode toggle
    const liveToggle = page.getByLabel(/Live Mode/i).first();
    if (await liveToggle.isVisible({ timeout: 5000 })) {
      // Test toggle
      await liveToggle.click();
    }
    
    // Check for refresh interval dropdown
    const intervalSelect = page.locator('select').filter({ hasText: /seconds|minutes/i }).first();
    if (await intervalSelect.isVisible({ timeout: 5000 })) {
      await intervalSelect.selectOption({ value: '60000' }); // 1 minute
    }
  });
});

