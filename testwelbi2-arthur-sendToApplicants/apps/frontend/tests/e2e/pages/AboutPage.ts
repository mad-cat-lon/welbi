import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AboutPage Page Object Model
 * 
 * Provides methods for interacting with the about page elements.
 * This class encapsulates all the page-specific logic and selectors.
 */
export class AboutPage extends BasePage {
  // Page elements
  private aboutTitle: Locator;
  private description: Locator;
  private architectureTitle: Locator;
  private architectureDescription: Locator;
  private backLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.aboutTitle = this.getByText('About TestWelbi');
    this.description = this.getByText(/This is a modern monorepo setup/);
    this.architectureTitle = this.getByText('Architecture');
    this.architectureDescription = this.getByText(/The application is built with a microservices architecture/);
    this.backLink = this.getByRole('link', { name: /back/i });
  }

  /**
   * Navigate to the about page
   */
  async navigateToAbout() {
    await this.goto('/about');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForAboutPageLoad() {
    await this.waitForElement(this.aboutTitle);
    await this.waitForElement(this.description);
    await this.waitForElement(this.architectureTitle);
  }

  /**
   * Get the about title text
   */
  async getAboutTitle(): Promise<string> {
    return this.getElementText(this.aboutTitle);
  }

  /**
   * Get the description text
   */
  async getDescription(): Promise<string> {
    return this.getElementText(this.description);
  }

  /**
   * Get the architecture title text
   */
  async getArchitectureTitle(): Promise<string> {
    return this.getElementText(this.architectureTitle);
  }

  /**
   * Get the architecture description text
   */
  async getArchitectureDescription(): Promise<string> {
    return this.getElementText(this.architectureDescription);
  }

  /**
   * Navigate back to home page
   */
  async navigateBackToHome() {
    if (await this.elementExists(this.backLink)) {
      await this.click(this.backLink);
    } else {
      await this.goto('/');
    }
    await this.waitForNavigation();
  }

  /**
   * Take a screenshot of the about page
   */
  async takeAboutPageScreenshot(name: string = 'about-page') {
    await this.takeScreenshot(name);
  }

  /**
   * Assert that the page is properly loaded
   */
  async assertPageLoaded() {
    await this.assertElementVisible(this.aboutTitle);
    await this.assertElementVisible(this.description);
    await this.assertElementVisible(this.architectureTitle);
  }

  /**
   * Assert that the page title is correct
   */
  async assertPageTitle() {
    const title = await this.getAboutTitle();
    expect(title).toBe('About TestWelbi');
  }

  /**
   * Assert that the description contains expected text
   */
  async assertDescriptionContains(expectedText: string) {
    const description = await this.getDescription();
    expect(description).toContain(expectedText);
  }

  /**
   * Assert that the architecture section is present
   */
  async assertArchitectureSectionPresent() {
    await this.assertElementVisible(this.architectureTitle);
    await this.assertElementVisible(this.architectureDescription);
  }

  /**
   * Assert current URL is about page
   */
  async assertCurrentUrlIsAbout() {
    await this.assertCurrentUrl(/.*\/about/);
  }

  /**
   * Get all text content from the page
   */
  async getAllPageContent(): Promise<string> {
    return this.getPageText();
  }

  /**
   * Check if page has all required elements
   */
  async hasAllRequiredElements(): Promise<boolean> {
    const requiredElements = [
      this.aboutTitle,
      this.description,
      this.architectureTitle,
      this.architectureDescription
    ];

    for (const element of requiredElements) {
      if (!(await this.isElementVisible(element))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Assert that all required elements are present
   */
  async assertAllRequiredElementsPresent() {
    expect(await this.hasAllRequiredElements()).toBe(true);
  }
} 