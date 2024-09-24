import { Locator, Page, expect } from 'playwright/test';
import BasePage from './BasePage';

export default class CPanelLicenses extends BasePage {  
  private cards: Locator;
  
  static Products = class {
    static readonly SOLO = { name: "cPanel Solo® Cloud (1 Account)", price: 17.49};
    static readonly ADMIN = { name: "cPanel Admin Cloud (5 Accounts)", price: 29.99};
    static readonly PRO = { name: "cPanel Pro Cloud (30 Accounts)", price: 42.99};
    static readonly PREMIER = { name: "cPanel Premier (100 Accounts)", price: 60.99};
    static readonly WP_SQUARED = { name: "WP Squared", price: 84.99};
  };

  constructor(page: Page) {
    super(page);
    this.cards = this.page.locator('.product.clearfix');
  }
  
  async open(): Promise<void> {
    await this.page.goto(`store/cpanel-licenses`);
  }
  
  async verifyHeadingVisible() {
    await this.visibleHeadingName('cPanel Licenses', true);
  }

  private getCardLocator(productName: string): Locator {
    return this.cards.filter({hasText: productName});
  }
  
  async verifyCardVisible(productName: string) {
    await this.visible(this.getCardLocator(productName), true);
  }
  async verifyCardOrderNowButtonVisible(productName: string) {
    await this.visible(this.getCardLocator(productName).locator('.btn-order-now'), true);
  }
  async clickCardOrderNowButton(productName: string) {
    await this.getCardLocator(productName).locator('.btn-order-now').click();
  }
}
