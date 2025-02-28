import {LoginPage} from 'sauce_demo_test/loginPage.js';
import {MainPage} from '$/mainPage.js';
import {CartPage} from '$/cartPage.js';
//import {ClassLinkSettingsPage} from '$/page-objects/adminPanel/CSM/classLinkSettingsPage.js';

function pageObjectsInstantiation(page, requiredContexts) {
	const pomList = [];
	const parameterConstructor = index => (requiredContexts === 1 ? page : page[index]);
	for (let i = 0; i < requiredContexts; i++) {
		const pageObjects = {
			loginPage: new LoginPage(parameterConstructor(i)),
			mainPage: new MainPage(parameterConstructor(i)),
			createLessonModalPage: new CreateLessonModalPage(parameterConstructor(i)),
			cartPage: new CartPage(parameterConstructor(i)),
		};
		pomList.push(pageObjects);
	}
	if (requiredContexts === 1) {
		return pomList[0];
	} else {
		return pomList;
	}
}

export default pageObjectsInstantiation;