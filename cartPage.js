export class CartPage {
    constructor(page) {
        this.page = page;
        this.articleCartName = page.locator('div[class="inventory_item_name"]');
        this.articleCartPrice = page.locator('div[class="inventory_item_price"]');
        this.generalCartButton = name => page.getByRole('button', {name});
        this.generalCartText = text => page.getByText(text);
    }
}