export class LoginPage {
	constructor(page) {
		this.page = page;
		this.loginFields = text => page.getByRole('placeholder', { name: text });
		this.loginButton = page.getByRole('button', { name: 'Login' });
		this.lockedOut = page.getByRole('heading', {name: 'Epic sadface: Sorry, this user has been locked out.'});
        this.xSymbol = page.locator('div[class="form_group"] svg');
	}
}