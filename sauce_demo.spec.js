//const {test, expect} = require('$/pageSetup.js');

const { test, expect } = require('@playwright/test');


//import {TestInfo, Response} from '@playwright/test';

const generateTitle = user => `Should be able to login with ${user} and add an item to the cart`;
const username = {
    standardUser: 'standard_user',
    lockedOutUser: 'locked_out_user',
    problemUser: 'problem_user',
    performanceGlitchUser: 'performance_glitch_user',
    errorUser: 'error_user',
    visualUser: 'visual_user',
};
const password = 'secret_sauce';

const logIn = async (page, user) => {
    await page.loginPage.loginFields('Username').type(user);
    await page.loginPage.loginFields('Password').type(password);
};

test.afterEach(async ({closeBrowser, teacherPage}) => {
    await closeBrowser([teacherPage], test);
});

test.describe.only(() => {
    for (const user in username) {
        test(generateTitle(user), async ({page}, testInfo) => {
            await test.step(`Log in flow`, async () => {
                await test.step(`User goes to saucedemo page`, async () => {
                    await page.loginPage.page.goto('https://www.saucedemo.com/');
                });
                await test.step('User logs in', async () => {
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
                    await logIn(page, usernameToUse);
                });
            });

            await test.step(`${username[user]} interacts with the page`, async () => {
                switch (username[user]) {
                    case username.standardUser:
                        const expectedTitle = await page.mainPage.articleName.getText();
                        const expectedPrice = await page.mainPage.articlePrice.getText();
                        await test.step('Verify that the elements in the page are displayed', async () => {
                            await Promise.all([
                                await expect.soft(page.mainPage.appLogo).toBeVisible(),
                                await expect.soft(page.mainPage.articleDescription).toBeVisible(),
                                await expect.soft(page.mainPage.articleDescription).toBeVisible(),
                                await expect.soft(page.mainPage.shoppingCart).toBeVisible(),
                                await expect.soft(page.mainPage.cartItem).not.toBeVisible(),
                            ]);
                        });

                        await test.step('Verify that an article can be added and removed', async () => {
                            await page.mainPage.productInteraction('Add to cart').first().click();
                            await expect.soft(page.mainPage.productInteraction('Remove')).first().toBeVisible();
                            await page.mainPage.productInteraction('Remove').first().click();
                            await page.mainPage.productInteraction('Add to cart').first().click();
                            await expect.soft(page.mainPage.cartItem).toBeVisible();
                        });

                        await test.step('User goes to shopping cart', async () => {
                            await Promise.all([
                                await page.mainPage.shoppingCart.click(),
                                page.reportsPage.page.waitForResponse(response => {
                                    const url = response.url();
                                    if (url.includes('data:image/png') && response.request().method() === 'POST' && response.status() === 200) {
                                        return true;
                                    }
                                }),
                            ]);
                        });

                        await test.step(`Verify the cart view elements are displayed`, async () => {
                            await Promise.all([
                                await expect.soft(page.cartPage.generalCartText('Your Cart')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartText('Description')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartButton('Remove')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartButton('Checkout')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartButton('Go back Continue Shopping')).toBeVisible(),
                            ]);
                        });

                        await test.step(`Verify the article name and price are correct`, async () => {
                            await Promise.all([
                                await expect.soft(page.cartPage.articleCartName).toContainText(expectedTitle),
                                await expect.soft(page.cartPage.articleCartPrice).toContainText(expectedPrice),
                                await expect.soft(page.cartPage.generalCartButton('Remove')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartButton('Checkout')).toBeVisible(),
                                await expect.soft(page.cartPage.generalCartButton('Go back Continue Shopping')).toBeVisible(),
                            ]);
                        });

                        break;

                    case username.lockedOutUser:
                        await test.step('Verify the locked out user view', async () => {
                            await Promise.all([
                                await expect.soft(page.loginPage.lockedOut).toBeVisible(),
                                await expect.soft(page.loginPage.xSymbol).toHaveCount(2),
                            ]);
                        });
                        break;

                    case username.problemUser:
                        await test.step('Verify the problem user view', async () => {
                            await expect.soft(page.mainPage.topHeader).toHaveScreenshot('problemUserView.png');
                        });
                        break;

                    case username.performanceGlitchUser:
                        await test.step('Verify the delay doing login', async () => {
                            const startTime = Date.now();
                            await page.page.waitForTimeout(5000);
                            const endTime = Date.now();
                            const duration = endTime - startTime;
                            expect.soft(duration).toBeGreaterThan(3000);
                        });
                        break;

                    case username.errorUser:
                        await test.step('Add an article to the cart', async () => {
                            await page.mainPage.productInteraction('Add to cart').first().click();
                        });
                        await test.step('Verify that there is an error trying to remove it', async () => {
                            await Promise.all([
                                page.mainPage.productInteraction('Remove').first().click(),
                                page.mainPage.page.waitForResponse(response => {
                                    const url = response.url();
                                    if (url.includes('/UNIVERSE/TOKEN/json') && response.request().method() === 'POST' && response.status() === 503) {
                                        return true;
                                    }
                                }),
                            ]);
                            await expect.soft(page.mainPage.cartItem).toBeVisible();
                        });
                        break;

                    case username.visualUser:
                        await test.step('Verify the incorrect view', async () => {
                            await expect.soft(page.mainPage.topHeader).toHaveScreenshot('visualErrorUser.png');
                        });
                        break;
                    default:
                        throw new Error(`No matching email for user ${username[user]}`);
                }
            });
        });
    }
});
