import { Page, Locator, expect } from 'playwright/test';

export default class BasePage {
    protected page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
  //common methods:
  async waitForPageLoading(state?: "load" | "domcontentloaded" | "networkidle") {
    await this.page.waitForLoadState(state);
  }

  async pressEnter(locator: Locator) {
    await locator.press("Enter");
  }

  async visible(newLocator: Locator, expected: boolean, message?: string, time?: number) {
    if (expected) {
        await expect(newLocator, message).toBeVisible(time ? { timeout: (time * 1000)} : undefined);
    } else {
        await expect(newLocator, message).not.toBeVisible(time ? { timeout: (time * 1000)} : undefined);
    }
  }

  async visibleHeadingName(headName: string, result: boolean) {
    await this.visible(this.page.getByRole('heading', { name: headName, exact: true }), result);
  }

  async checked(newLocator: Locator, expected: boolean, message?: string) {
      if (expected) {
          await expect(newLocator, message).toBeChecked();
      } else {
          await expect(newLocator, message).not.toBeChecked();
      }
  }
  
  async verifyOverlayVisible(result: boolean) {
    await this.visible(this.page.locator('#fullpage-overlay').first(), result);
  }
  

  protected getProtractedRatio(): number {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const dayOfMonth = today.getDate();
    return (daysInMonth - dayOfMonth + 1) / daysInMonth;
  }
}