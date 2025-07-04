import { test, expect } from '@playwright/test';

/**
 * Basic E2E Test to verify Playwright setup
 * This test ensures that the basic infrastructure is working
 */

test.describe('Basic E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is present
    await expect(page).toHaveTitle(/TestWelbi/);
    
    // Check that the welcome message is present
    await expect(page.getByText('Welcome to TestWelbi')).toBeVisible();
  });

  test('should display backend connection status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for backend connection status
    const statusText = await page.getByText(/Backend is connected successfully/);
    await expect(statusText).toBeVisible();
  });

  test('should display calendar section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for calendar section
    await expect(page.getByText('Events Calendar')).toBeVisible();
  });

  test('should display sidebar section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for sidebar section
    await expect(page.getByText('Recent Events')).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to about page
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the about page
    await expect(page.getByText('About TestWelbi')).toBeVisible();
    await expect(page.url()).toContain('/about');
  });

  test('should handle page responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads on mobile
    await expect(page.getByText('Welcome to TestWelbi')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads on tablet
    await expect(page.getByText('Welcome to TestWelbi')).toBeVisible();
  });
}); 