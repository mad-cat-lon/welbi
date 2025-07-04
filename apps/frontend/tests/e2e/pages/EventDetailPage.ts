import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * EventDetailPage Page Object Model
 * 
 * Provides methods for interacting with the event detail page elements.
 * This class encapsulates all the page-specific logic and selectors.
 */
export class EventDetailPage extends BasePage {
  // Page elements
  private eventTitle: Locator;
  private eventDescription: Locator;
  private loadingTitle: Locator;
  private errorTitle: Locator;
  private notFoundTitle: Locator;

  // Status badges
  private statusBadge: Locator;
  private registrationBadge: Locator;
  private allDayBadge: Locator;

  // Date & Time section
  private dateTimeSection: Locator;
  private startTimeLabel: Locator;
  private startTimeValue: Locator;
  private endTimeLabel: Locator;
  private endTimeValue: Locator;
  private durationInfo: Locator;

  // Participation section
  private participationSection: Locator;
  private capacityLabel: Locator;
  private currentParticipants: Locator;
  private maxParticipants: Locator;
  private progressBar: Locator;
  private availableSpots: Locator;
  private registrationDeadline: Locator;

  // Additional information
  private additionalInfoSection: Locator;
  private eventId: Locator;
  private createdAt: Locator;
  private updatedAt: Locator;
  private notes: Locator;

  // Navigation
  private backButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.eventTitle = this.getBySelector('[data-testid="event-title"]');
    this.eventDescription = this.getBySelector('[data-testid="event-description"]');
    this.loadingTitle = this.getByText('Loading Event Details...');
    this.errorTitle = this.getByText('Error Loading Event');
    this.notFoundTitle = this.getByText('Event Not Found');

    // Status badges
    this.statusBadge = this.getBySelector('[data-testid="status-badge"]');
    this.registrationBadge = this.getByText('Registration Required');
    this.allDayBadge = this.getByText('All Day Event');

    // Date & Time section
    this.dateTimeSection = this.getBySelector('[data-testid="date-time-section"]');
    this.startTimeLabel = this.getByText('Start Time');
    this.startTimeValue = this.getBySelector('[data-testid="start-time-value"]');
    this.endTimeLabel = this.getByText('End Time');
    this.endTimeValue = this.getBySelector('[data-testid="end-time-value"]');
    this.durationInfo = this.getBySelector('[data-testid="duration-info"]');

    // Participation section
    this.participationSection = this.getBySelector('[data-testid="participation-section"]');
    this.capacityLabel = this.getByText('Capacity');
    this.currentParticipants = this.getBySelector('[data-testid="current-participants"]');
    this.maxParticipants = this.getBySelector('[data-testid="max-participants"]');
    this.progressBar = this.getBySelector('[data-testid="progress-bar"]');
    this.availableSpots = this.getBySelector('[data-testid="available-spots"]');
    this.registrationDeadline = this.getBySelector('[data-testid="registration-deadline"]');

    // Additional information
    this.additionalInfoSection = this.getBySelector('[data-testid="additional-info-section"]');
    this.eventId = this.getBySelector('[data-testid="event-id"]');
    this.createdAt = this.getBySelector('[data-testid="created-at"]');
    this.updatedAt = this.getBySelector('[data-testid="updated-at"]');
    this.notes = this.getBySelector('[data-testid="event-notes"]');

    // Navigation
    this.backButton = this.getByText('← Back to Calendar');
  }

  /**
   * Navigate to event detail page
   */
  async navigateToEvent(eventId: string) {
    await this.goto(`/event/${eventId}`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForEventDetailLoad() {
    await Promise.race([
      this.waitForElement(this.eventTitle, 10000),
      this.waitForElement(this.loadingTitle, 10000),
      this.waitForElement(this.errorTitle, 10000),
      this.waitForElement(this.notFoundTitle, 10000)
    ]);
  }

  /**
   * Check if page is loading
   */
  async isLoading(): Promise<boolean> {
    return await this.elementExists(this.loadingTitle);
  }

  /**
   * Check if page has an error
   */
  async hasError(): Promise<boolean> {
    return await this.elementExists(this.errorTitle);
  }

  /**
   * Check if event is not found
   */
  async isEventNotFound(): Promise<boolean> {
    return await this.elementExists(this.notFoundTitle);
  }

  /**
   * Get event title
   */
  async getEventTitle(): Promise<string> {
    return this.getElementText(this.eventTitle);
  }

  /**
   * Get event description
   */
  async getEventDescription(): Promise<string> {
    return this.getElementText(this.eventDescription);
  }

  /**
   * Get event status
   */
  async getEventStatus(): Promise<string> {
    return this.getElementText(this.statusBadge);
  }

  /**
   * Check if registration is required
   */
  async isRegistrationRequired(): Promise<boolean> {
    return await this.elementExists(this.registrationBadge);
  }

  /**
   * Check if event is all day
   */
  async isAllDayEvent(): Promise<boolean> {
    return await this.elementExists(this.allDayBadge);
  }

  /**
   * Get start time
   */
  async getStartTime(): Promise<string> {
    return this.getElementText(this.startTimeValue);
  }

  /**
   * Get end time
   */
  async getEndTime(): Promise<string> {
    return this.getElementText(this.endTimeValue);
  }

  /**
   * Get duration
   */
  async getDuration(): Promise<string> {
    return this.getElementText(this.durationInfo);
  }

  /**
   * Get current participants count
   */
  async getCurrentParticipants(): Promise<string> {
    return this.getElementText(this.currentParticipants);
  }

  /**
   * Get max participants count
   */
  async getMaxParticipants(): Promise<string> {
    return this.getElementText(this.maxParticipants);
  }

  /**
   * Get available spots
   */
  async getAvailableSpots(): Promise<string> {
    return this.getElementText(this.availableSpots);
  }

  /**
   * Get registration deadline
   */
  async getRegistrationDeadline(): Promise<string> {
    return this.getElementText(this.registrationDeadline);
  }

  /**
   * Get event ID
   */
  async getEventId(): Promise<string> {
    return this.getElementText(this.eventId);
  }

  /**
   * Get created date
   */
  async getCreatedDate(): Promise<string> {
    return this.getElementText(this.createdAt);
  }

  /**
   * Get updated date
   */
  async getUpdatedDate(): Promise<string> {
    return this.getElementText(this.updatedAt);
  }

  /**
   * Get event notes
   */
  async getEventNotes(): Promise<string> {
    return this.getElementText(this.notes);
  }

  /**
   * Navigate back to calendar
   */
  async navigateBackToCalendar() {
    await this.click(this.backButton);
    await this.waitForNavigation();
  }

  /**
   * Take a screenshot of the event detail page
   */
  async takeEventDetailScreenshot(name: string = 'event-detail') {
    await this.takeScreenshot(name);
  }

  /**
   * Assert that the page is properly loaded
   */
  async assertPageLoaded() {
    await this.assertElementVisible(this.eventTitle);
    await this.assertElementHidden(this.loadingTitle);
  }

  /**
   * Assert that event title matches expected value
   */
  async assertEventTitle(expectedTitle: string) {
    const title = await this.getEventTitle();
    expect(title).toBe(expectedTitle);
  }

  /**
   * Assert that event status matches expected value
   */
  async assertEventStatus(expectedStatus: string) {
    const status = await this.getEventStatus();
    expect(status.toLowerCase()).toContain(expectedStatus.toLowerCase());
  }

  /**
   * Assert that registration is required
   */
  async assertRegistrationRequired() {
    await this.assertElementVisible(this.registrationBadge);
  }

  /**
   * Assert that event is all day
   */
  async assertAllDayEvent() {
    await this.assertElementVisible(this.allDayBadge);
  }

  /**
   * Assert that date and time section is present
   */
  async assertDateTimeSectionPresent() {
    await this.assertElementVisible(this.dateTimeSection);
    await this.assertElementVisible(this.startTimeLabel);
    await this.assertElementVisible(this.endTimeLabel);
  }

  /**
   * Assert that participation section is present
   */
  async assertParticipationSectionPresent() {
    await this.assertElementVisible(this.participationSection);
    await this.assertElementVisible(this.capacityLabel);
  }

  /**
   * Assert that additional info section is present
   */
  async assertAdditionalInfoSectionPresent() {
    await this.assertElementVisible(this.additionalInfoSection);
  }

  /**
   * Assert that progress bar is visible
   */
  async assertProgressBarVisible() {
    await this.assertElementVisible(this.progressBar);
  }

  /**
   * Assert that event has notes
   */
  async assertEventHasNotes() {
    await this.assertElementVisible(this.notes);
  }

  /**
   * Assert current URL is event detail page
   */
  async assertCurrentUrlIsEventDetail(eventId: string) {
    await this.assertCurrentUrl(new RegExp(`.*\/event\/${eventId}`));
  }

  /**
   * Check if all main sections are visible
   */
  async areAllSectionsVisible(): Promise<boolean> {
    const sections = [
      this.dateTimeSection,
      this.participationSection,
      this.additionalInfoSection
    ];

    for (const section of sections) {
      if (!(await this.isElementVisible(section))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Assert that all sections are visible
   */
  async assertAllSectionsVisible() {
    expect(await this.areAllSectionsVisible()).toBe(true);
  }

  /**
   * Get all event information as an object
   */
  async getEventInformation() {
    return {
      title: await this.getEventTitle(),
      description: await this.getEventDescription(),
      status: await this.getEventStatus(),
      startTime: await this.getStartTime(),
      endTime: await this.getEndTime(),
      duration: await this.getDuration(),
      currentParticipants: await this.getCurrentParticipants(),
      maxParticipants: await this.getMaxParticipants(),
      availableSpots: await this.getAvailableSpots(),
      registrationDeadline: await this.getRegistrationDeadline(),
      eventId: await this.getEventId(),
      createdDate: await this.getCreatedDate(),
      updatedDate: await this.getUpdatedDate(),
      notes: await this.getEventNotes(),
      registrationRequired: await this.isRegistrationRequired(),
      allDay: await this.isAllDayEvent()
    };
  }

  /**
   * Assert that event information matches expected values
   */
  async assertEventInformation(expectedInfo: Partial<Awaited<ReturnType<typeof this.getEventInformation>>>) {
    const actualInfo = await this.getEventInformation();
    
    for (const [key, expectedValue] of Object.entries(expectedInfo)) {
      if (expectedValue !== undefined) {
        expect(actualInfo[key as keyof typeof actualInfo]).toBe(expectedValue);
      }
    }
  }
} 