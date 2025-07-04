import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Start the browser and navigate to the app to ensure it's working
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the base URL to ensure the app is accessible
    await page.goto(baseURL || 'http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Global setup completed - app is accessible');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 