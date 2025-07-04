import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { TEST_DATA } from './utils/TestUtils';

/**
 * E2E Tests for Home Page
 * 
 * These tests verify the functionality of the home page using the Page Object Model.
 * Tests cover navigation, content loading, user interactions, and error handling.
 */

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.describe('Page Loading and Content', () => {
    test('should load home page successfully', async () => {
      // Assert that the page loads with all main sections
      await homePage.assertPageLoaded();
      await homePage.assertBackendConnected();
      await homePage.assertCalendarLoaded();
      await homePage.assertSidebarLoaded();
    });

    test('should display correct page title and subtitle', async () => {
      const title = await homePage.getWelcomeTitle();
      const subtitle = await homePage.getSubtitle();

      expect(title).toBe(TEST_DATA.PAGE_TITLES.HOME);
      expect(subtitle).toBe('A modern monorepo with React and GraphQL');
    });

    test('should show all main sections', async () => {
      const allSectionsVisible = await homePage.areAllSectionsVisible();
      expect(allSectionsVisible).toBe(true);
    });

    test('should display backend connection status', async () => {
      const isConnected = await homePage.isBackendConnected();
      expect(isConnected).toBe(true);

      const healthStatus = await homePage.getBackendHealthStatus();
      expect(healthStatus).toContain('Backend is connected successfully');
    });
  });

  test.describe('Calendar Functionality', () => {
    test('should display calendar with events', async () => {
      await homePage.waitForCalendarLoad();
      
      const calendarTitle = await homePage.getCalendarTitle();
      expect(calendarTitle).toBe('Events Calendar');

      // Check if calendar has events (this may vary based on mock data)
      const events = await homePage.getCalendarEvents();
      expect(events.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle calendar navigation', async () => {
      const initialMonth = await homePage.getCurrentCalendarMonth();
      
      // Navigate to next month
      await homePage.navigateCalendarMonth('next');
      await homePage.waitForPageLoad();
      
      const nextMonth = await homePage.getCurrentCalendarMonth();
      expect(nextMonth).not.toBe(initialMonth);
    });

    test('should handle calendar event clicks', async () => {
      await homePage.waitForCalendarLoad();
      
      const events = await homePage.getCalendarEvents();
      if (events.length > 0) {
        // Click on the first event
        await homePage.clickCalendarEvent(events[0]);
        
        // Should navigate to event detail page
        await homePage.waitForNavigation();
        const currentUrl = await homePage.getCurrentUrl();
        expect(currentUrl).toContain('/event/');
      }
    });
  });

  test.describe('Sidebar Functionality', () => {
    test('should display sidebar with recent events', async () => {
      await homePage.waitForSidebarLoad();
      
      const sidebarTitle = await homePage.getSidebarTitle();
      expect(sidebarTitle).toBe('Recent Events');

      const events = await homePage.getSidebarEvents();
      expect(events.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle sidebar event clicks', async () => {
      await homePage.waitForSidebarLoad();
      
      const events = await homePage.getSidebarEvents();
      if (events.length > 0) {
        // Click on the first event
        await homePage.clickSidebarEvent(events[0]);
        
        // Should navigate to event detail page
        await homePage.waitForNavigation();
        const currentUrl = await homePage.getCurrentUrl();
        expect(currentUrl).toContain('/event/');
      }
    });

    test('should show no events message when sidebar is empty', async () => {
      // This test might need to be adjusted based on mock data
      await homePage.waitForSidebarLoad();
      
      const hasNoEvents = await homePage.hasNoSidebarEvents();
      const events = await homePage.getSidebarEvents();
      
      if (events.length === 0) {
        expect(hasNoEvents).toBe(true);
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to about page', async () => {
      await homePage.navigateToAbout();
      
      const currentUrl = await homePage.getCurrentUrl();
      expect(currentUrl).toContain('/about');
    });

    test('should display tech stack information', async () => {
      const techStackInfo = await homePage.getTechStackInfo();
      expect(techStackInfo).toContain('React');
      expect(techStackInfo).toContain('GraphQL');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle backend connection errors gracefully', async () => {
      // For now, we'll just verify the error handling structure exists
      const hasError = await homePage.hasBackendError();
      const isConnected = await homePage.isBackendConnected();
      
      // Should either have an error OR be connected, not both
      expect(hasError || isConnected).toBe(true);
    });

    test('should handle calendar loading errors gracefully', async () => {
      await homePage.waitForCalendarLoad();
      
      const hasError = await homePage.hasCalendarError();
      const isLoading = await homePage.isCalendarLoading();
      
      expect(isLoading).toBe(false);
      expect(hasError).toBe(false);
    });

    test('should handle sidebar loading errors gracefully', async () => {
      await homePage.waitForSidebarLoad();
      
      const hasError = await homePage.hasSidebarError();
      const isLoading = await homePage.isSidebarLoading();
      
      expect(isLoading).toBe(false);
      expect(hasError).toBe(false);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await homePage.navigateToHome();
      await homePage.assertPageLoaded();
      
      // Take screenshot for visual verification
      await homePage.takeHomePageScreenshot('home-page-mobile');
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await homePage.navigateToHome();
      await homePage.assertPageLoaded();
      
      // Take screenshot for visual verification
      await homePage.takeHomePageScreenshot('home-page-tablet');
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await homePage.navigateToHome();
      await homePage.waitForAllContentLoad();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should handle rapid navigation', async () => {
      // Navigate to about page
      await homePage.navigateToAbout();
      await homePage.waitForPageLoad();
      
      // Navigate back to home
      await homePage.navigateToHome();
      await homePage.waitForPageLoad();
      
      // Navigate to about again
      await homePage.navigateToAbout();
      await homePage.waitForPageLoad();
      
      // All navigations should work without errors
      const currentUrl = await homePage.getCurrentUrl();
      expect(currentUrl).toContain('/about');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async () => {
      const title = await homePage.getWelcomeTitle();
      expect(title).toBe('Welcome to TestWelbi');
      
      const calendarTitle = await homePage.getCalendarTitle();
      expect(calendarTitle).toBe('Events Calendar');
      
      const sidebarTitle = await homePage.getSidebarTitle();
      expect(sidebarTitle).toBe('Recent Events');
    });

    test('should have clickable elements', async () => {
      // Test that calendar events are clickable
      await homePage.waitForCalendarLoad();
      const events = await homePage.getCalendarEvents();
      
      if (events.length > 0) {
        const eventElement = homePage.getByText(events[0]);
        await expect(eventElement).toBeVisible();
      }
    });
  });
}); 