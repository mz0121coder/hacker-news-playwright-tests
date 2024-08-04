import { test, expect } from '@playwright/test';

test('assert time links are sorted from newest to oldest', async ({ page }) => {
	await page.goto('https://news.ycombinator.com/newest');

	// Get all links matching the regex pattern
	const timeLinks = await page
		.getByRole('link')
		.filter({ hasText: /\d+ minute(s)? ago/ })
		.all();

	// Extract the minutes from the text content
	const minutesArray = await Promise.all(
		timeLinks.map(async link => {
			const text = await link.textContent();
			const match = text?.match(/(\d+) minute(s)? ago/);
			return match ? parseInt(match[1], 10) : null; // Parse the number of minutes
		})
	);

	// Filter out any null values (in case of no match)
	const filteredMinutes = minutesArray.filter(min => min !== null);

	// Create a sorted copy of the array in ascending order
	const sortedMinutes = [...filteredMinutes].sort(
		(a, b) => (a || 0) - (b || 0)
	);

	// Assert that the original array is sorted from newest to oldest
	expect(filteredMinutes).toEqual(sortedMinutes);
});
