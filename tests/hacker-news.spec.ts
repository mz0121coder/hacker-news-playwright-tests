import { test, expect, Locator } from '@playwright/test';

test('assert time links are sorted from newest to oldest', async ({ page }) => {
	await page.goto('https://news.ycombinator.com/newest');

	// Store minutes from article links
	const timesInMinutes: (number | undefined)[] = [];

	while (timesInMinutes.length < 100) {
		// Get all links matching the regex pattern
		const timeLinks: Locator[] = await page
			.getByRole('link')
			.filter({ hasText: /\d+ (minute|hour|day|year)(s)? ago/i })
			.all();

		// Extract the time in minutes from the text content
		const minutesArray = await Promise.all(
			timeLinks.map(async link => {
				const text = await link.textContent();
				const time = Number(text?.replace(/\D+/g, '') || '0');
				const periodMatch = text?.match(/(minute|hour|day|year)(s)? ago/i);
				const period = periodMatch ? periodMatch[1].toLowerCase() : null;

				const timeConversion = {
					minute: 1,
					hour: 60,
					day: 1440,
					year: 525600, // Assuming a year has 365 days
				};

				return period ? time * timeConversion[period] : undefined;
			})
		);

		// Filter out any undefined values
		const filteredMinutes: (number | undefined)[] = minutesArray.filter(
			min => min !== undefined
		);

		// Add new minutes to the main array, up to a maximum of 100
		timesInMinutes.push(
			...filteredMinutes.slice(0, 100 - timesInMinutes.length)
		);

		// Click the 'More' link if available and if we haven't reached 100 yet
		const moreLink = await page.getByRole('link', { name: 'More' }).first();
		if (moreLink && timesInMinutes.length < 100) {
			await expect(moreLink).toBeVisible(); // Ensure it's visible
			await moreLink.click();
			await page.waitForTimeout(5000); // Wait for new content to load (firefox and webkit are slower)
		} else {
			break; // Exit if there are no more links
		}
	}

	// Assert that we have collected the expected number of time links
	expect(timesInMinutes.length).toBeLessThanOrEqual(100);

	// Create a sorted copy of the array in ascending order
	const sortedMinutes = [...timesInMinutes].sort((a, b) => (a || 0) - (b || 0));
	// Assert that the original array is sorted from newest to oldest
	expect(timesInMinutes).toEqual(sortedMinutes);
});
