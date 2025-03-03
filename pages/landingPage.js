const articleInteraction = require('../test-data/productVariables.js').productVariables.landing;
export class LandingPage {
    constructor(page) {
        this.page = page;
        this.appLogo = page.locator('div[class="app_logo"]');
        this.interactionButton = (text) => page.locator(`button:has-text("${text}")`);
        this.topHeader = page.locator('div[class="header_container"]');
        this.articleName = page.locator('div[class="inventory_item_name "]');
        this.articleDescription = page.locator('div[class="inventory_item_desc"]');
        this.articlePrice = page.locator('div[class="inventory_item_price"]');
        this.shoppingCart = page.locator('div[class="shopping_cart_container"]');
        this.cartItem = this.shoppingCart.locator('span[class="shopping_cart_badge"]');
    }

    addArticle = async (shouldTryRemoveFlow = false) => {
		await this.interactionButton(articleInteraction.add).first().click();
        if (shouldTryRemoveFlow) {
            await this.interactionButton(articleInteraction.remove).first().click();
        }
	};
}

module.exports = { LandingPage };