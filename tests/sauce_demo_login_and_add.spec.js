const { test, expect } = require('@playwright/test');
const productVariables = require('../test-data/productVariables.js').productVariables;
const lockedOut = productVariables.login.lockedOut;
const articleInteraction = productVariables.landing;
const cart = productVariables.cart;
const generateTitle = user => `Should be able to login with ${user} and add an item to the cart`;
const username = {
    // standardUser: 'standard_user',
    // lockedOutUser: 'locked_out_user',
    // problemUser: 'problem_user', 
    // performanceGlitchUser: 'performance_glitch_user',
    errorUser: 'error_user',
    // visualUser: 'visual_user',
};

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test.describe.configure({mode: 'parallel'});
test.describe.only(() => {
    for (const user in username) {
        test(generateTitle(user), async ({page}, testInfo) => {
            const { LoginPage } = require('../pages/loginPage');
            const loginPage = new LoginPage(page);
            const { LandingPage } = require('../pages/landingPage');
            const landingPage = new LandingPage(page);
            const { CartPage } = require('../pages/cartPage');
            const cartPage = new CartPage(page);
            await test.step('Log in flow', async () => {
                await test.step('Get user to test', async () => {
                    let usernameToUse;
                    for (const key of Object.keys(username)) {
                        if (testInfo.title.includes(key)) {
                            usernameToUse = username[key];
                            break;
                        }
                    }
                    if (!usernameToUse) {
                        throw new Error(`No matching user found for test: ${testInfo.title}`);
                    }
                    if (!usernameToUse) {
                        throw new Error(`Email not found for ${usernameToUse}`);
                    }
                    await test.step(`Log in with ${usernameToUse}`, async () => {
                        const password = 'secret_sauce';
                        await loginPage.logIn(usernameToUse, password);
                    });
                });
            });
            await test.step(`${username[user]} interacts with the page`, async () => {
                switch (username[user]) {
                    case username.standardUser:
                        const expectedTitle = await landingPage.articleName.first().innerText();
                        const expectedPrice = await landingPage.articlePrice.first().innerText();
                        await test.step('Verify that the elements in the page are displayed', async () => {
                            await landingPage.appLogo.waitFor();
                            await Promise.all([
                                await expect.soft(landingPage.appLogo).toBeVisible(),
                                await expect.soft(landingPage.articleName.first()).toBeVisible(),
                                await expect.soft(landingPage.articleDescription.first()).toBeVisible(),
                                await expect.soft(landingPage.shoppingCart).toBeVisible(),
                                await expect.soft(landingPage.cartItem).not.toBeVisible(),
                            ]);
                        });
                        await test.step('Verify that an article can be added and removed', async () => {
                            await landingPage.addArticle(true);
                            await expect.soft(landingPage.cartItem).not.toBeVisible();
                        });
                        await test.step('Add article again', async () => {
                            await landingPage.addArticle(false);
                            await expect.soft(landingPage.cartItem).toBeVisible();
                        });
                        await test.step('Go to cart and verify that the elements are displayed', async () => {
                            await Promise.all([
                                await landingPage.shoppingCart.click(),
                                await expect.soft(cartPage.yourCart).toBeVisible(),
                                await expect.soft(cartPage.description).toBeVisible(),
                                await expect.soft(cartPage.generalCartButton(cart.remove)).toBeVisible(),
                                await expect.soft(cartPage.generalCartButton(cart.checkout)).toBeVisible(),
                                await expect.soft(cartPage.generalCartButton(cart.continueShopping)).toBeVisible(),
                            ]);
                        });
                        await test.step('Verify the article name and price are correct', async () => {
                            await Promise.all([
                                await expect.soft(cartPage.articleCartName).toContainText(expectedTitle),
                                await expect.soft(cartPage.articleCartPrice).toContainText(expectedPrice),
                            ]);
                        });
                        break;
                    case username.lockedOutUser:
                        await test.step('Verify the locked out user view', async () => {
                            await Promise.all([
                                await expect.soft(loginPage.lockedOut).toContainText(lockedOut),
                                await expect.soft(loginPage.xSymbol).toHaveCount(2),
                            ]);
                        });
                        break;
                    case username.problemUser:
                        break;
                    case username.errorUser:
                        await test.step('Add an article to the cart', async () => {
                            await landingPage.interactionButton(articleInteraction.add).first().click();
                            await expect.soft(landingPage.cartItem).toBeVisible();
                        });
                        await test.step('Verify that there is an error trying to remove it', async () => {
                            try {
                                await landingPage.interactionButton(articleInteraction.remove).first().click();
                                await expect.soft(landingPage.cartItem).toBeVisible();
                                throw new Error('Remove button should not be clickable for error_user.');
                                } catch (e) {
                                    console.error('The article was removed');
                                }
                            });
                        break;
                    case username.performanceGlitchUser:
                        await test.step('Verify the delay doing login', async () => {
                            const startTime = Date.now();
                            await page.waitForTimeout(5000);
                            const endTime = Date.now();
                            const duration = endTime - startTime;
                            expect.soft(duration).toBeGreaterThan(3000);
                        });
                        break;
                    case username.visualUser:
                        await test.step('Verify the incorrect view', async () => {
                            await expect.soft(landingPage.topHeader).toHaveScreenshot('visualErrorUser.png');
                        });
                        break;
                    default:
                        throw new Error(`No matching email for user ${username[user]}`);
                }
            });
        });
    }
});
