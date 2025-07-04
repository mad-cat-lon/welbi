import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage Page Object Model
 * 
 * Provides methods for interacting with the home page elements.
 * This class encapsulates all the page-specific logic and selectors.
 */
export class HomePage extends BasePage {
  // Page elements
  private welcomeTitle: Locator;
  private subtitle: Locator;
  private backendStatusCard: Locator;
  private calendarCard: Locator;
  private sidebarCard: Locator;
  private techStackCard: Locator;

  // Backend status elements
  private healthStatusText: Locator;
  private healthErrorText: Locator;
  private healthLoadingText: Locator;

  // Calendar elements
  private calendarTitle: Locator;
  private calendarLoadingText: Locator;
  private calendarErrorText: Locator;
  private calendarContainer: Locator;

  // Sidebar elements
  private sidebarTitle: Locator;
  private sidebarLoadingText: Locator;
  private sidebarErrorText: Locator;
  private sidebarEventsList: Locator;
  private noEventsText: Locator;

  // Navigation elements
  private aboutLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.welcomeTitle = this.getByText('Welcome to TestWelbi');
    this.subtitle = this.getByText('A modern monorepo with React and GraphQL');
    
    // Backend status elements
    this.backendStatusCard = this.getBySelector('[data-testid="backend-status-card"]');
    this.healthStatusText = this.getByText(/Backend is connected successfully/);
    this.healthErrorText = this.getByText(/Backend connection failed/);
    this.healthLoadingText = this.getByText(/Checking backend connection/);

    // Calendar elements
    this.calendarCard = this.getBySelector('[data-testid="calendar-card"]');
    this.calendarTitle = this.getByText('Events Calendar');
    this.calendarLoadingText = this.getByText('Loading calendar events');
    this.calendarErrorText = this.getByText(/Failed to load calendar events/);
    this.calendarContainer = this.getBySelector('[data-testid="calendar-container"]');

    // Sidebar elements
    this.sidebarCard = this.getBySelector('[data-testid="sidebar-card"]');
    this.sidebarTitle = this.getByText('Recent Events');
    this.sidebarLoadingText = this.getByText('Loading events');
    this.sidebarErrorText = this.getByText(/Failed to load events/);
    this.sidebarEventsList = this.getBySelector('[data-testid="sidebar-events-list"]');
    this.noEventsText = this.getByText('No events found');

    // Tech stack elements
    this.techStackCard = this.getBySelector('[data-testid="tech-stack-card"]');

    // Navigation
    this.aboutLink = this.getByRole('link', { name: /about/i });
  }

  /**
   * Navigate to the home page
   */
  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForHomePageLoad() {
    await this.waitForElement(this.welcomeTitle);
    await this.waitForElement(this.calendarTitle);
    await this.waitForElement(this.sidebarTitle);
  }

  /**
   * Get the welcome title text
   */
  async getWelcomeTitle(): Promise<string> {
    return this.getElementText(this.welcomeTitle);
  }

  /**
   * Get the subtitle text
   */
  async getSubtitle(): Promise<string> {
    return this.getElementText(this.subtitle);
  }

  /**
   * Check if backend is connected successfully
   */
  async isBackendConnected(): Promise<boolean> {
    return await this.elementExists(this.healthStatusText);
  }

  /**
   * Get backend health status text
   */
  async getBackendHealthStatus(): Promise<string> {
    if (await this.elementExists(this.healthStatusText)) {
      return this.getElementText(this.healthStatusText);
    }
    return '';
  }

  /**
   * Check if backend has an error
   */
  async hasBackendError(): Promise<boolean> {
    return await this.elementExists(this.healthErrorText);
  }

  /**
   * Get backend error message
   */
  async getBackendErrorMessage(): Promise<string> {
    if (await this.elementExists(this.healthErrorText)) {
      return this.getElementText(this.healthErrorText);
    }
    return '';
  }

  /**
   * Check if backend is loading
   */
  async isBackendLoading(): Promise<boolean> {
    return await this.elementExists(this.healthLoadingText);
  }

  /**
   * Wait for backend status to be loaded
   */
  async waitForBackendStatus() {
    await Promise.race([
      this.waitForElement(this.healthStatusText, 10000),
      this.waitForElement(this.healthErrorText, 10000)
    ]);
  }

  /**
   * Get calendar title
   */
  async getCalendarTitle(): Promise<string> {
    return this.getElementText(this.calendarTitle);
  }

  /**
   * Check if calendar is loading
   */
  async isCalendarLoading(): Promise<boolean> {
    return await this.elementExists(this.calendarLoadingText);
  }

  /**
   * Check if calendar has an error
   */
  async hasCalendarError(): Promise<boolean> {
    return await this.elementExists(this.calendarErrorText);
  }

  /**
   * Get calendar error message
   */
  async getCalendarErrorMessage(): Promise<string> {
    if (await this.elementExists(this.calendarErrorText)) {
      return this.getElementText(this.calendarErrorText);
    }
    return '';
  }

  /**
   * Wait for calendar to be loaded
   */
  async waitForCalendarLoad() {
    await Promise.race([
      this.waitForElementHidden(this.calendarLoadingText, 10000),
      this.waitForElement(this.calendarErrorText, 10000)
    ]);
  }

  /**
   * Get all calendar events
   */
  async getCalendarEvents(): Promise<string[]> {
    const eventElements = this.page.locator('[data-testid="calendar-event"]');
    const count = await eventElements.count();
    const events: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const eventText = await eventElements.nth(i).textContent();
      if (eventText) {
        events.push(eventText);
      }
    }
    
    return events;
  }

  /**
   * Click on a calendar event
   */
  async clickCalendarEvent(eventTitle: string) {
    const eventElement = this.getByText(eventTitle);
    await this.click(eventElement);
  }

  /**
   * Get sidebar title
   */
  async getSidebarTitle(): Promise<string> {
    return this.getElementText(this.sidebarTitle);
  }

  /**
   * Check if sidebar is loading
   */
  async isSidebarLoading(): Promise<boolean> {
    return await this.elementExists(this.sidebarLoadingText);
  }

  /**
   * Check if sidebar has an error
   */
  async hasSidebarError(): Promise<boolean> {
    return await this.elementExists(this.sidebarErrorText);
  }

  /**
   * Get sidebar error message
   */
  async getSidebarErrorMessage(): Promise<string> {
    if (await this.elementExists(this.sidebarErrorText)) {
      return this.getElementText(this.sidebarErrorText);
    }
    return '';
  }

  /**
   * Wait for sidebar to be loaded
   */
  async waitForSidebarLoad() {
    await Promise.race([
      this.waitForElementHidden(this.sidebarLoadingText, 10000),
      this.waitForElement(this.sidebarErrorText, 10000),
      this.waitForElement(this.noEventsText, 10000)
    ]);
  }

  /**
   * Get all sidebar events
   */
  async getSidebarEvents(): Promise<string[]> {
    const eventElements = this.page.locator('[data-testid="sidebar-event"]');
    const count = await eventElements.count();
    const events: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const eventText = await eventElements.nth(i).textContent();
      if (eventText) {
        events.push(eventText);
      }
    }
    
    return events;
  }

  /**
   * Click on a sidebar event
   */
  async clickSidebarEvent(eventTitle: string) {
    const eventElement = this.getByText(eventTitle);
    await this.click(eventElement);
  }

  /**
   * Check if there are no events in sidebar
   */
  async hasNoSidebarEvents(): Promise<boolean> {
    return await this.elementExists(this.noEventsText);
  }

  /**
   * Navigate to calendar month
   */
  async navigateCalendarMonth(direction: 'prev' | 'next') {
    const button = direction === 'prev' 
      ? this.getByRole('button', { name: /previous month/i })
      : this.getByRole('button', { name: /next month/i });
    
    await this.click(button);
  }

  /**
   * Get current calendar month and year
   */
  async getCurrentCalendarMonth(): Promise<string> {
    const monthElement = this.getBySelector('[data-testid="calendar-month-year"]');
    return this.getElementText(monthElement);
  }

  /**
   * Click on a specific date in the calendar
   */
  async clickCalendarDate(date: string) {
    const dateElement = this.getBySelector(`[data-testid="calendar-date-${date}"]`);
    await this.click(dateElement);
  }

  /**
   * Navigate to About page
   */
  async navigateToAbout() {
    await this.click(this.aboutLink);
    await this.waitForNavigation();
  }

  /**
   * Get tech stack information
   */
  async getTechStackInfo(): Promise<string> {
    const techStackElement = this.getBySelector('[data-testid="tech-stack-list"]');
    return this.getElementText(techStackElement);
  }

  /**
   * Check if all main sections are visible
   */
  async areAllSectionsVisible(): Promise<boolean> {
    const sections = [
      this.backendStatusCard,
      this.calendarCard,
      this.sidebarCard,
      this.techStackCard
    ];

    for (const section of sections) {
      if (!(await this.isElementVisible(section))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Wait for all content to be loaded
   */
  async waitForAllContentLoad() {
    await Promise.all([
      this.waitForBackendStatus(),
      this.waitForCalendarLoad(),
      this.waitForSidebarLoad()
    ]);
  }

  /**
   * Take a screenshot of the home page
   */
  async takeHomePageScreenshot(name: string = 'home-page') {
    await this.takeScreenshot(name);
  }

  /**
   * Assert that the page is properly loaded
   */
  async assertPageLoaded() {
    await this.assertElementVisible(this.welcomeTitle);
    await this.assertElementVisible(this.calendarTitle);
    await this.assertElementVisible(this.sidebarTitle);
  }

  /**
   * Assert that backend is connected
   */
  async assertBackendConnected() {
    await this.assertElementVisible(this.healthStatusText);
  }

  /**
   * Assert that calendar is loaded
   */
  async assertCalendarLoaded() {
    await this.assertElementVisible(this.calendarTitle);
    await this.assertElementHidden(this.calendarLoadingText);
  }

  /**
   * Assert that sidebar is loaded
   */
  async assertSidebarLoaded() {
    await this.assertElementVisible(this.sidebarTitle);
    await this.assertElementHidden(this.sidebarLoadingText);
  }

  /**
   * Assert that there are events in the sidebar
   */
  async assertSidebarHasEvents() {
    const events = await this.getSidebarEvents();
    expect(events.length).toBeGreaterThan(0);
  }

  /**
   * Assert that there are no events in the sidebar
   */
  async assertSidebarHasNoEvents() {
    await this.assertElementVisible(this.noEventsText);
  }

  /**
   * Assert that calendar has events
   */
  async assertCalendarHasEvents() {
    const events = await this.getCalendarEvents();
    expect(events.length).toBeGreaterThan(0);
  }

  /**
   * Assert that calendar has no events
   */
  async assertCalendarHasNoEvents() {
    const events = await this.getCalendarEvents();
    expect(events.length).toBe(0);
  }
} 