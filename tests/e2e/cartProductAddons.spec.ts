import {test, Page} from 'playwright/test';
import CPanelLicenses from '../../pom/pages/cPanelLicenses';
import ShoppingCart from '../../pom/pages/shoppingCart';
import ReviewCheckout from '../../pom/pages/reviewCheckout';
import Checkout from '../../pom/pages/checkout';

test.describe('Test add product with addons', () => {
    const ipAddress = '1.2.3.4';
    const testProduct = CPanelLicenses.Products.PRO;
    const testAddons = [ 
        ShoppingCart.Addons.CloudLinux, 
        ShoppingCart.Addons.CloudLinux_cPanel, 
        ShoppingCart.Addons.ImunifyAV
    ];
    const totalPrice = testAddons.reduce((sum, addon) => sum + addon.price, 0) + testProduct.price;

    test.describe.configure({mode: 'serial'});
    let page: Page;
    let cPanelLicenses: CPanelLicenses;
    let shoppingCart: ShoppingCart;
    let reviewCheckout: ReviewCheckout;
    let checkout: Checkout;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage({ storageState: undefined }); //ensure that user is not logged in
        cPanelLicenses = new CPanelLicenses(page);
        shoppingCart = new ShoppingCart(page);
        reviewCheckout = new ReviewCheckout(page);
        checkout = new Checkout(page);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('1 Navigate to the cPanel store', async () => {
        await cPanelLicenses.open();
    });
    
    test('2 Order a Product', async () => {
        await cPanelLicenses.verifyHeadingVisible();
        await cPanelLicenses.verifyCardVisible(testProduct.name);
        await cPanelLicenses.verifyCardOrderNowButtonVisible(testProduct.name);
        await cPanelLicenses.clickCardOrderNowButton(testProduct.name);
    });

    test('3 Enter IP Address', async () => {
        await shoppingCart.verifyHeadingVisible();
        await shoppingCart.verifyOverlayVisible(false);
        await shoppingCart.verifyIpAddressLabelVisible();
        await shoppingCart.verifyIpAddressFieldVisible();
        await shoppingCart.fillIpAddressField(ipAddress);
    });
        
    test('4 Select Addons', async () => {
        await shoppingCart.verifyAddonVisible(testAddons[0].name);
        await shoppingCart.verifyAddonVisible(testAddons[1].name);
        await shoppingCart.verifyAddonVisible(testAddons[2].name);
        await shoppingCart.clickAddon(testAddons[0].name);
        await shoppingCart.clickAddon(testAddons[1].name);
        await shoppingCart.clickAddon(testAddons[2].name);
    });

    test('5 Continue to Review & Checkout', async () => {
        await shoppingCart.verifySummaryProductVisible(testProduct.name);
        await shoppingCart.verifySummaryContains(testAddons[0].name);
        await shoppingCart.verifySummaryContains(testAddons[1].name);
        await shoppingCart.verifySummaryContains(testAddons[2].name);
        await shoppingCart.verifyContinueButtonVisible();
        await shoppingCart.verifyContinueButtonEnabled();
        await shoppingCart.clickContinueButton();
        await shoppingCart.verifyContinueSpinnerVisible(false)
    });

    test('6 Verify Product and Price', async () => {
        await test.step('Verify the expected products and addons are present (names).', async () => {
            await reviewCheckout.verifyHeadingVisible();
            await reviewCheckout.verifyOverlayVisible(false);
            await reviewCheckout.verifyProductNameVisible(testProduct.name);
            await reviewCheckout.verifyAddonNameVisible(testAddons[0].name);
            await reviewCheckout.verifyAddonNameVisible(testAddons[1].name);
            await reviewCheckout.verifyAddonNameVisible(testAddons[2].name);
        });
        await test.step('Ensure prices are correct', async () => {
            await reviewCheckout.verifyProductCorrectPriceVisible(testProduct.name, totalPrice); //Need ask does it show base price or calculated - Possible a bug
            await reviewCheckout.verifyAddonCorrectPriceVisible(testAddons[0].name, testAddons[0].price);
            await reviewCheckout.verifyAddonCorrectPriceVisible(testAddons[1].name, testAddons[1].price);
            await reviewCheckout.verifyAddonCorrectPriceVisible(testAddons[2].name, testAddons[2].price);
        });
        await test.step('Ensure protracted prices are correct', async () => {
            await reviewCheckout.verifyProductProratedPriceVisible(testProduct.name, testProduct.price);
            await reviewCheckout.verifyAddonProratedPriceVisible(testAddons[0].name, testAddons[0].price);
            await reviewCheckout.verifyAddonProratedPriceVisible(testAddons[1].name, testAddons[1].price);
            await reviewCheckout.verifyAddonProratedPriceVisible(testAddons[2].name, testAddons[2].price);
        });
    });

    test('7 Proceed to Checkout', async () => {
        await reviewCheckout.verifyCheckoutButtonVisible();
        await reviewCheckout.clickCheckoutButton();
    });

    test('8 Verify Checkout Information', async () => {
        await test.step('Ensure the information in the product table is correct', async () => {
            await test.step('The license names are correct.', async () => {
                await checkout.verifyHeadingVisible();
                await checkout.verifyOverlayVisible(false);
                await checkout.verifyItemNameVisible(testProduct.name);
                await checkout.verifyItemNameVisible(testAddons[0].name);
                await checkout.verifyItemNameVisible(testAddons[1].name);
                await checkout.verifyItemNameVisible(testAddons[2].name);
            });
            await test.step('The IP address is shown.', async () => {
                await checkout.verifyItemCorrectIpVisible(testProduct.name, ipAddress);
                await checkout.verifyItemCorrectIpVisible(testAddons[0].name, ipAddress);
                await checkout.verifyItemCorrectIpVisible(testAddons[1].name, ipAddress);
                await checkout.verifyItemCorrectIpVisible(testAddons[2].name, ipAddress);
            });
            await test.step('The monthly price is correct.', async () => {
                await checkout.verifyItemCorrectMonthlyPriceVisible(testProduct.name, totalPrice); //Need ask does it show base price or calculated - Possible a bug
                await checkout.verifyItemCorrectMonthlyPriceVisible(testAddons[0].name, testAddons[0].price);
                await checkout.verifyItemCorrectMonthlyPriceVisible(testAddons[1].name, testAddons[1].price);
                await checkout.verifyItemCorrectMonthlyPriceVisible(testAddons[2].name, testAddons[2].price);
            });
            await test.step('The "Due Today" prices are correct.', async () => {
                await checkout.verifyItemCorrectDuePriceVisible(testProduct.name, testProduct.price);
                await checkout.verifyItemCorrectDuePriceVisible(testAddons[0].name, testAddons[0].price);
                await checkout.verifyItemCorrectDuePriceVisible(testAddons[1].name, testAddons[1].price);
                await checkout.verifyItemCorrectDuePriceVisible(testAddons[2].name, testAddons[2].price);
            });
        });

        await test.step(`Verify that the sections are visible`, async () => {
            await checkout.verifyPersonalInfoSectionVisible();
            await checkout.verifyBillingAddressSectionVisible();
            await checkout.verifyAccountSecuritySectionSectionVisible();
            await checkout.verifyTermsConditionsSectionSectionVisible();
            await checkout.verifyPaymentDetailsSectionSectionVisible();
        });
            
        await test.step(`Verify that the 'Complete Order' button is visible but disabled.`, async () => {
            await checkout.verifyCompleteOrderButtonVisible();
            await checkout.verifyCompleteOrderButtonDisabled();
        });
    });
});
