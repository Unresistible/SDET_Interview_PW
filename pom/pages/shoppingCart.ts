import { Locator, Page, expect } from 'playwright/test';
import BasePage from './BasePage';

export default class ShoppingCart extends BasePage {
  private addons: Locator;
  private summaryContainer: Locator;
  private continueButton: Locator;
  
  static Addons = class {
    static readonly CloudLinux = {name: "Monthly CloudLinux", price: 26};
    static readonly CloudLinux_cPanel = {name: "Monthly CloudLinux for cPanel License", price: 16};
    static readonly KernelCare = {name: "Monthly KernelCare License", price: 3};
    static readonly LiteSpeed8 = {name: " LiteSpeed 8GB", price: 25};
    static readonly LiteSpeedUnlim = {name: "LiteSpeed UNLIMITED", price: 45};
    static readonly JetBackup = {name: "JetBackup", price: 8.95};
    static readonly Imunify360 = {name: "Monthly Imunify360 (Unlimited)", price: 45};
    static readonly ImunifyAV = {name: "Monthly ImunifyAV+", price: 6};
    static readonly WHMCS_Plus = {name: "WHMCS Plus", price: 18.95};
    static readonly WHMCS_Professional = {name: "WHMCS Professional", price: 29.95};
    static readonly WHMCS_1000 = {name: "WHMCS Business 1000", price: 44.95};
    static readonly WHMCS_2500 = {name: "WHMCS Business 2500", price: 99.95};
    static readonly WHMCS_5k = {name: "WHMCS Business 5000", price: 174.95};
    static readonly WHMCS_10k = {name: "WHMCS Business 10000", price: 299.95};
    static readonly WHMCSs_50k = {name: "WHMCS Business 50000", price: 849.95};
    static readonly WHMCS_100k = {name: "WHMCS Business 100000", price: 999.95};
    static readonly WHMCS_Unlimited = {name: "WHMCS Business Unlimited", price: 1299.95};
  };

  constructor(page: Page) {
    super(page);
    this.addons = this.page.locator('#productAddonsContainer div div');
    this.summaryContainer = this.page.locator('.summary-container');
    this.continueButton = this.page.locator('button[id="btnCompleteProductConfig"]');
  }
  
  async verifyHeadingVisible() {
    await this.visibleHeadingName('Configure', true);
  }

  private getAddonLocator(addonName: string): Locator {
    return this.addons.filter({ has: this.page.getByText(addonName, { exact: true }) }).first();
  }
  
  async verifyIpAddressLabelVisible() {
    await this.visible(this.page.getByLabel('IP Address *'), true);
  }
  async verifyIpAddressFieldVisible() {
    await this.visible(this.page.locator('input[id="customfield19"]'), true);
  }
  async fillIpAddressField(ipAddress: string) {
    await this.page.locator('input[id="customfield19"]').fill(ipAddress);
  }

  async verifySummaryProductVisible(productName: string) {
    await this.visible(this.summaryContainer.getByText(productName).first(), true);
  }
  async verifySummaryContains(item: string) {
    await this.visible(this.summaryContainer.getByText(`+ ${item}`, {exact: true}), true);
  }

  async verifyContinueButtonVisible() {
    await this.visible(this.continueButton, true);
  }
  async verifyContinueButtonEnabled() {
    await expect(this.continueButton).toBeEnabled();
  }
  async clickContinueButton() {
    await this.continueButton.click();
  }
  async verifyContinueSpinnerVisible(result: boolean) {
    await this.visible(this.continueButton.locator('.fa-spinner'), result);
  }

  async verifyAddonVisible(addonName: string) {
    await this.visible(this.getAddonLocator(addonName), true);
  }
  async clickAddon(addonName: string) {
    await expect(this.getAddonLocator(addonName)).toBeEnabled();
    await this.getAddonLocator(addonName).click();
  }
}
