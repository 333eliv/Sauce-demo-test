export class MainPage {
    constructor(page) {
        this.page = page;
        this.appLogo = page.locator('div[class="app_logo"]');
        this.productInteraction = name => page.getByRole('button', {name});
        this.topHeader = page.locator('div[class="header_container"]');
        this.articleName = page.locator('div[class="inventory_item_name "]');
        this.articleDescription = page.locator('div[class="inventory_item_desc"]');
        this.articlePrice = page.locator('div[class="inventory_item_price"]');
        this.shoppingCart = page.locator('a[class="shopping_cart_link"]');
        this.cartItem = this.shoppingCart.locator('span');
    }
}
