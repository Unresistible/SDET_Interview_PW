import { Locator, Page, expect } from 'playwright/test';
import BasePage from './BasePage';

export default class ReviewCheckout extends BasePage {
  private items: Locator;
  private checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = this.page.locator('.view-cart-items .item');
    this.checkoutButton = this.page.locator('#checkout');
  }
  
  async verifyHeadingVisible() {
    await this.visibleHeadingName('Review & Checkout', true);
  }
  
  private getProductLocator(productName: string): Locator {    
    return this.items.filter({ hasText: productName }).first();
  }
  async verifyProductNameVisible(productName: string) {
    await this.visible(this.getProductLocator(productName).getByText(productName), true);
  }
  async verifyProductCorrectPriceVisible(productName: string, productPrice: number) {
    await this.visible(this.getProductLocator(productName).getByText(`$${productPrice.toFixed(2)} USD Monthly`), true);
  }
  async verifyProductProratedPriceVisible(productName: string, productPrice: number) {
    const protractedPrice = productPrice * this.getProtractedRatio();
    await this.visible(this.getProductLocator(productName).getByText(`$${protractedPrice.toFixed(2)} USD`), true);
  }

  private getAddonLocator(addonName: string): Locator {    
    return this.items.filter({ has: this.page.getByText(addonName, { exact: true }) }).first();
  }
  async verifyAddonNameVisible(addonName: string) {
    await this.visible(this.getAddonLocator(addonName).getByText(addonName), true);
  }
  async verifyAddonCorrectPriceVisible(addonName: string, addonPrice: number) {
    await this.visible(this.getAddonLocator(addonName).getByText(`$${addonPrice.toFixed(2)} USD Monthly`), true);
  }
  async verifyAddonProratedPriceVisible(addonName: string, addonPrice: number) {
    const protractedPrice = addonPrice * this.getProtractedRatio();
    await this.visible(this.getAddonLocator(addonName).getByText(`$${protractedPrice.toFixed(2)} USD`), true);
  }

  async verifyCheckoutButtonVisible() {
    await this.visible(this.checkoutButton, true);
  }
  async clickCheckoutButton() {
    await this.checkoutButton.click();
  }
}
