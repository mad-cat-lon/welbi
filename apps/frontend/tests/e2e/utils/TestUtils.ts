import { Page, expect } from '@playwright/test';

/**
 * Test Utilities for E2E Tests
 * 
 * Provides common test functions, data, and utilities for e2e tests.
 * This file contains reusable test data and helper functions.
 */

/**
 * Test data constants
 */
export const TEST_DATA = {
  // Event data
  EVENTS: {
    VALID_EVENT_ID: 'test-event-1',
    INVALID_EVENT_ID: 'non-existent-event',
    VALID_EVENT_TITLE: 'Test Event',
    VALID_EVENT_DESCRIPTION: 'This is a test event description',
    VALID_EVENT_STATUS: 'scheduled',
    VALID_EVENT_START_TIME: '2025-01-15T10:00:00Z',
    VALID_EVENT_END_TIME: '2025-01-15T12:00:00Z',
    VALID_EVENT_DURATION: '2 hours 0 minutes',
    VALID_EVENT_CURRENT_PARTICIPANTS: '8',
    VALID_EVENT_MAX_PARTICIPANTS: '20',
    VALID_EVENT_AVAILABLE_SPOTS: '12 spots available',
    VALID_EVENT_REGISTRATION_DEADLINE: 'Jan 14, 6:00 PM',
    VALID_EVENT_NOTES: 'Important notes about this event',
  },

  // Page titles
  PAGE_TITLES: {
    HOME: 'Welcome to TestWelbi',
    ABOUT: 'About TestWelbi',
    EVENT_DETAIL: 'Test Event',
  },

  // Loading messages
  LOADING_MESSAGES: {
    EVENT_DETAIL: 'Loading Event Details...',
    CALENDAR_EVENTS: 'Loading calendar events...',
    SIDEBAR_EVENTS: 'Loading events...',
    BACKEND_HEALTH: 'Checking backend connection...',
  },

  // Error messages
  ERROR_MESSAGES: {
    EVENT_NOT_FOUND: 'Event Not Found',
    EVENT_LOAD_ERROR: 'Error Loading Event',
    BACKEND_CONNECTION_FAILED: 'Backend connection failed',
    CALENDAR_LOAD_FAILED: 'Failed to load calendar events',
    SIDEBAR_LOAD_FAILED: 'Failed to load events',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    BACKEND_CONNECTED: 'Backend is connected successfully',
    NO_EVENTS_FOUND: 'No events found',
  },

  // URLs
  URLS: {
    HOME: '/',
    ABOUT: '/about',
    EVENT_DETAIL: (eventId: string) => `/event/${eventId}`,
  },

  // Timeouts
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 15000,
  },
} as const;

/**
 * Test helper functions
 */
export class TestUtils {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible
   */
  static async waitForElementVisible(page: Page, selector: string, timeout = 5000) {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForElementHidden(page: Page, selector: string, timeout = 5000) {
    await page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Take a screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Assert that element contains text
   */
  static async assertElementContainsText(page: Page, selector: string, expectedText: string) {
    await expect(page.locator(selector)).toContainText(expectedText);
  }

  /**
   * Assert that element is visible
   */
  static async assertElementVisible(page: Page, selector: string) {
    await expect(page.locator(selector)).toBeVisible();
  }

  /**
   * Assert that element is hidden
   */
  static async assertElementHidden(page: Page, selector: string) {
    await expect(page.locator(selector)).not.toBeVisible();
  }

  /**
   * Assert that URL matches pattern
   */
  static async assertUrlMatches(page: Page, urlPattern: string | RegExp) {
    await expect(page).toHaveURL(urlPattern);
  }

  /**
   * Get element text content
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    return await page.locator(selector).textContent() || '';
  }

  /**
   * Click element
   */
  static async clickElement(page: Page, selector: string) {
    await page.locator(selector).click();
  }

  /**
   * Fill input field
   */
  static async fillInput(page: Page, selector: string, value: string) {
    await page.locator(selector).fill(value);
  }

  /**
   * Check if element exists
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    return await page.locator(selector).count() > 0;
  }

  /**
   * Wait for network request to complete
   */
  static async waitForNetworkIdle(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Reload page
   */
  static async reloadPage(page: Page) {
    await page.reload();
  }

  /**
   * Navigate to URL
   */
  static async navigateTo(page: Page, url: string) {
    await page.goto(url);
    await this.waitForPageLoad(page);
  }

  /**
   * Go back in browser history
   */
  static async goBack(page: Page) {
    await page.goBack();
    await this.waitForPageLoad(page);
  }

  /**
   * Get page title
   */
  static async getPageTitle(page: Page): Promise<string> {
    return page.title();
  }

  /**
   * Assert page title
   */
  static async assertPageTitle(page: Page, expectedTitle: string) {
    const title = await this.getPageTitle(page);
    expect(title).toBe(expectedTitle);
  }

  /**
   * Wait for multiple elements to be visible
   */
  static async waitForMultipleElements(page: Page, selectors: string[], timeout = 5000) {
    await Promise.all(
      selectors.map(selector => 
        page.locator(selector).waitFor({ state: 'visible', timeout })
      )
    );
  }

  /**
   * Assert that all elements are visible
   */
  static async assertAllElementsVisible(page: Page, selectors: string[]) {
    for (const selector of selectors) {
      await this.assertElementVisible(page, selector);
    }
  }

  /**
   * Assert that at least one element is visible
   */
  static async assertAtLeastOneElementVisible(page: Page, selectors: string[]) {
    const visibleElements = await Promise.all(
      selectors.map(selector => this.elementExists(page, selector))
    );
    expect(visibleElements.some(exists => exists)).toBe(true);
  }

  /**
   * Get all text content from page
   */
  static async getAllPageText(page: Page): Promise<string> {
    return await page.textContent('body') || '';
  }

  /**
   * Assert that page contains text
   */
  static async assertPageContainsText(page: Page, expectedText: string) {
    const pageText = await this.getAllPageText(page);
    expect(pageText).toContain(expectedText);
  }

  /**
   * Assert that page does not contain text
   */
  static async assertPageDoesNotContainText(page: Page, unexpectedText: string) {
    const pageText = await this.getAllPageText(page);
    expect(pageText).not.toContain(unexpectedText);
  }

  /**
   * Wait for element count
   */
  static async waitForElementCount(page: Page, selector: string, count: number, timeout = 5000) {
    await expect(page.locator(selector)).toHaveCount(count, { timeout });
  }

  /**
   * Assert element count
   */
  static async assertElementCount(page: Page, selector: string, expectedCount: number) {
    await expect(page.locator(selector)).toHaveCount(expectedCount);
  }

  /**
   * Get element attribute
   */
  static async getElementAttribute(page: Page, selector: string, attribute: string): Promise<string | null> {
    return await page.locator(selector).getAttribute(attribute);
  }

  /**
   * Assert element attribute
   */
  static async assertElementAttribute(page: Page, selector: string, attribute: string, expectedValue: string) {
    await expect(page.locator(selector)).toHaveAttribute(attribute, expectedValue);
  }

  /**
   * Hover over element
   */
  static async hoverOverElement(page: Page, selector: string) {
    await page.locator(selector).hover();
  }

  /**
   * Double click element
   */
  static async doubleClickElement(page: Page, selector: string) {
    await page.locator(selector).dblclick();
  }

  /**
   * Right click element
   */
  static async rightClickElement(page: Page, selector: string) {
    await page.locator(selector).click({ button: 'right' });
  }

  /**
   * Press key
   */
  static async pressKey(page: Page, key: string) {
    await page.keyboard.press(key);
  }

  /**
   * Type text
   */
  static async typeText(page: Page, text: string) {
    await page.keyboard.type(text);
  }

  /**
   * Scroll to element
   */
  static async scrollToElement(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get element bounding box
   */
  static async getElementBoundingBox(page: Page, selector: string) {
    return await page.locator(selector).boundingBox();
  }

  /**
   * Check if element is visible
   */
  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    return await page.locator(selector).isVisible();
  }

  /**
   * Check if element is enabled
   */
  static async isElementEnabled(page: Page, selector: string): Promise<boolean> {
    return await page.locator(selector).isEnabled();
  }

  /**
   * Clear input field
   */
  static async clearInput(page: Page, selector: string) {
    await page.locator(selector).clear();
  }

  /**
   * Select option from dropdown
   */
  static async selectOption(page: Page, selector: string, value: string | string[]) {
    await page.locator(selector).selectOption(value);
  }

  /**
   * Check checkbox
   */
  static async checkCheckbox(page: Page, selector: string) {
    await page.locator(selector).check();
  }

  /**
   * Uncheck checkbox
   */
  static async uncheckCheckbox(page: Page, selector: string) {
    await page.locator(selector).uncheck();
  }

  /**
   * Assert checkbox is checked
   */
  static async assertCheckboxChecked(page: Page, selector: string) {
    await expect(page.locator(selector)).toBeChecked();
  }

  /**
   * Assert checkbox is unchecked
   */
  static async assertCheckboxUnchecked(page: Page, selector: string) {
    await expect(page.locator(selector)).not.toBeChecked();
  }
}

/**
 * Test data generators
 */
export class TestDataGenerator {
  /**
   * Generate a random event ID
   */
  static generateEventId(): string {
    return `test-event-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a random event title
   */
  static generateEventTitle(): string {
    const titles = [
      'Team Meeting',
      'Product Launch',
      'Conference Call',
      'Workshop Session',
      'Training Day',
      'Client Presentation',
      'Strategy Meeting',
      'Review Session'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  /**
   * Generate a random event description
   */
  static generateEventDescription(): string {
    const descriptions = [
      'This is an important meeting to discuss project progress.',
      'Join us for an exciting product launch event.',
      'Regular team sync to align on goals and objectives.',
      'Interactive workshop to improve team collaboration.',
      'Training session to enhance skills and knowledge.',
      'Client presentation to showcase our latest work.',
      'Strategic planning session for the upcoming quarter.',
      'Review session to evaluate performance and outcomes.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Generate a future date
   */
  static generateFutureDate(daysFromNow: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  }

  /**
   * Generate a past date
   */
  static generatePastDate(daysAgo: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }
} 