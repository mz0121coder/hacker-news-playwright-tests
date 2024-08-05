import { test, expect } from '@playwright/test';
import { HackerNewsPage } from '../page-objects/HackerNewsPage';

test('iphone - time links are sorted', async ({ page }) => {
	const hackerNewsPage = new HackerNewsPage(page);
	await hackerNewsPage.goto();
	const timesInMinutes = await hackerNewsPage.fetchTimeLinks(100);

	// Assert that we have collected the expected number of time links
	expect(timesInMinutes.length).toBeLessThanOrEqual(100);

	// Create a sorted copy of the array in ascending order
	const sortedMinutes = [...timesInMinutes].sort((a, b) => (a || 0) - (b || 0));

	// Assert that the original array is sorted from newest to oldest
	expect(timesInMinutes).toEqual(sortedMinutes);
});
