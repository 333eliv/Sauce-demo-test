const loginTexts = require('../test-data/productVariables.js').productVariables.login;
class LoginPage {
	constructor(page) {
		this.page = page;
		this.loginFields = (text) => page.locator(`input[placeholder="${text}"]`);
		this.loginButton = page.locator('input[class="submit-button btn_action"]');
		this.lockedOut = page.locator('div[class="error-message-container error"]');
        this.xSymbol = page.locator('div[class="form_group"] svg');
		this.errorMessages = {
			username: page.locator(loginTexts.usernameError),
			password: page.locator(loginTexts.passwordError),
			both: page.locator(loginTexts.bothError),
		}
	}

	logIn = async (username, password) => {
		await this.loginFields(loginTexts.loginFields.username).fill(username);
		await this.loginFields(loginTexts.loginFields.password).fill(password);
		await this.loginButton.click();
	};
}

module.exports = { LoginPage };