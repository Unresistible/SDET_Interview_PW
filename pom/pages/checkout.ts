import { Locator, Page, expect } from 'playwright/test';
import BasePage from './BasePage';

export default class Checkout extends BasePage {
  private tableItems: Locator;
  private completeOrderButton: Locator;
  private personalInfoSection: Locator;
  private billingAddressSection: Locator;
  private accountSecuritySection: Locator;
  private termsConditionsSection: Locator;
  private paymentDetailsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.tableItems = this.page.locator('table tbody tr');
    this.completeOrderButton = this.page.locator('#btnCompleteOrder');

    this.personalInfoSection = this.page.locator('.sub-heading').getByText(`Personal Information`);
    this.billingAddressSection = this.page.locator('.sub-heading').getByText(`Billing Address`);
    this.accountSecuritySection = this.page.locator('.sub-heading').getByText(`Account Security`);
    this.termsConditionsSection = this.page.locator('.sub-heading').getByText(`Terms & Conditions`);
    this.paymentDetailsSection = this.page.locator('.sub-heading').getByText(`Payment Details`);
  }
  
  async verifyHeadingVisible() {
    await this.visibleHeadingName('Checkout', true);
  }

  private getTableItemLocator(itemName: string): Locator {    
    return this.tableItems.filter({ has: this.page.getByText(itemName, { exact: true }) });
  }
  async verifyItemNameVisible(itemName: string) {
    await this.visible(this.getTableItemLocator(itemName).locator('td').nth(0).getByText(itemName), true);
  }
  async verifyItemCorrectIpVisible(itemName: string, ipAddress: string) {
    await this.visible(this.getTableItemLocator(itemName).locator('td').nth(2).getByText(ipAddress), true);
  }
  async verifyItemCorrectMonthlyPriceVisible(itemName: string, price: number) {
    await this.visible(this.getTableItemLocator(itemName).locator('td').nth(3).getByText(`${price.toFixed(2)} USD`), true);
  }
  async verifyItemCorrectDuePriceVisible(itemName: string, price: number) {
    const protractedPrice = price * this.getProtractedRatio();
    await this.visible(this.getTableItemLocator(itemName).locator('td').nth(4).getByText(`${protractedPrice.toFixed(2)} USD`), true);
  }

  async verifyCompleteOrderButtonVisible() {
    await this.visible(this.completeOrderButton, true);
  }
  async verifyCompleteOrderButtonDisabled() {
    await expect(this.completeOrderButton).toBeDisabled();
  }
  async verifyCompleteOrderButtonEnabled() {
    await expect(this.completeOrderButton).toBeEnabled();
  }
  async clickCompleteOrderButton() {
    await this.completeOrderButton.click();
  }
  
  async verifyPersonalInfoSectionVisible() {
    await this.visible(this.personalInfoSection, true);
  }
  async verifyBillingAddressSectionVisible() {
    await this.visible(this.billingAddressSection, true);
  }
  async verifyAccountSecuritySectionSectionVisible() {
    await this.visible(this.accountSecuritySection, true);
  }
  async verifyTermsConditionsSectionSectionVisible() {
    await this.visible(this.termsConditionsSection, true);
  }
  async verifyPaymentDetailsSectionSectionVisible() {
    await this.visible(this.paymentDetailsSection, true);
  }
}
