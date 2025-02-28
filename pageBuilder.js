import base from '@playwright/test';
import pageObjectsInstantiation from '$/pageSetup.js';

import waitForUserServices from '$/fixtures/waitForUserServices.js';

export const test = base.test.extend({
	waitForUserServices: async ({}, use) => {
		await use(async page => {
			await waitForUserServices(page);
		});
	},
	closeBrowser: async ({}, use) => {
		await use(async pages => {
			for (const page of pages) {
				await page.context().close();
			}
			networkData.isSlowNetworkRequested = false;
			networkData.speedConnection = 0;
			contextData.requiredTeacherContexts = 1;
			contextData.requiredGuestContexts = 1;
			contextData.storageStateCreated = 0;
			contextData.storageStateUsed = 0;
		});
	},

	page: async ({page}, use) => {
		const page = pageObjectsInstantiation(page, contextData.requiredTeacherContexts);
		await use(page);
	},
});

global.softGenericAssertion = base.expect.configure({soft: true});
export const expect = base.expect;
export const request = base.request;

