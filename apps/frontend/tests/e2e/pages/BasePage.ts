import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model class
 * 
 * Provides common functionality and utilities for all page objects.
 * This class serves as the foundation for all page-specific POMs.
 */
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string = 'http://localhost:5173') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to the page
   */
  async goto(path: string = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for the page to be loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get a locator by text content
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Get a locator by role and name
   */
  getByRole(role: string, options?: { name?: string | RegExp }): Locator {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Get a locator by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get a locator by CSS selector
   */
  getBySelector(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click an element
   */
  async click(locator: Locator) {
    await locator.click();
  }

  /**
   * Fill an input field
   */
  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  /**
   * Type into an input field
   */
  async type(locator: Locator, value: string) {
    await locator.type(value);
  }

  /**
   * Assert that an element is visible
   */
  async assertElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that an element is hidden
   */
  async assertElementHidden(locator: Locator) {
    await expect(locator).not.toBeVisible();
  }

  /**
   * Assert that an element contains text
   */
  async assertElementContainsText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert that an element has a specific value
   */
  async assertElementValue(locator: Locator, value: string) {
    await expect(locator).toHaveValue(value);
  }

  /**
   * Assert that an element is enabled
   */
  async assertElementEnabled(locator: Locator) {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert that an element is disabled
   */
  async assertElementDisabled(locator: Locator) {
    await expect(locator).toBeDisabled();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForURL('**');
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for a specific URL
   */
  async waitForUrl(url: string | RegExp) {
    await this.page.waitForURL(url);
  }

  /**
   * Assert current URL
   */
  async assertCurrentUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Get all text content from the page
   */
  async getPageText(): Promise<string> {
    return this.page.textContent('body') || '';
  }

  /**
   * Check if element exists
   */
  async elementExists(locator: Locator): Promise<boolean> {
    return await locator.count() > 0;
  }

  /**
   * Wait for element to exist
   */
  async waitForElementExists(locator: Locator, timeout: number = 5000) {
    await expect(locator).toHaveCount(1, { timeout });
  }

  /**
   * Wait for element count
   */
  async waitForElementCount(locator: Locator, count: number, timeout: number = 5000) {
    await expect(locator).toHaveCount(count, { timeout });
  }

  /**
   * Hover over an element
   */
  async hover(locator: Locator) {
    await locator.hover();
  }

  /**
   * Double click an element
   */
  async doubleClick(locator: Locator) {
    await locator.dblclick();
  }

  /**
   * Right click an element
   */
  async rightClick(locator: Locator) {
    await locator.click({ button: 'right' });
  }

  /**
   * Press a key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text
   */
  async typeText(text: string) {
    await this.page.keyboard.type(text);
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return locator.getAttribute(attribute);
  }

  /**
   * Assert element attribute
   */
  async assertElementAttribute(locator: Locator, attribute: string, value: string) {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  /**
   * Get element CSS property
   */
  async getElementCSSProperty(locator: Locator, property: string): Promise<string> {
    return locator.evaluate((el, prop) => {
      const styles = window.getComputedStyle(el);
      return styles.getPropertyValue(prop);
    }, property);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for DOM content loaded
   */
  async waitForDOMContentLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get element bounding box
   */
  async getElementBoundingBox(locator: Locator) {
    return locator.boundingBox();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Get element text content
   */
  async getElementText(locator: Locator): Promise<string> {
    return locator.textContent() || '';
  }

  /**
   * Get element inner text
   */
  async getElementInnerText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  /**
   * Clear input field
   */
  async clearInput(locator: Locator) {
    await locator.clear();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: Locator, value: string | string[]) {
    await locator.selectOption(value);
  }

  /**
   * Check checkbox
   */
  async checkCheckbox(locator: Locator) {
    await locator.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheckCheckbox(locator: Locator) {
    await locator.uncheck();
  }

  /**
   * Assert checkbox is checked
   */
  async assertCheckboxChecked(locator: Locator) {
    await expect(locator).toBeChecked();
  }

  /**
   * Assert checkbox is unchecked
   */
  async assertCheckboxUnchecked(locator: Locator) {
    await expect(locator).not.toBeChecked();
  }
} 