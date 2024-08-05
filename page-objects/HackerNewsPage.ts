import { Page, Locator } from '@playwright/test';

export class HackerNewsPage {
	private page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('https://news.ycombinator.com/newest');
		await this.page.waitForLoadState('domcontentloaded');
	}

	async handleErrorMessage() {
		const errorMessageLocator = this.page.getByText(
			"Sorry, we're not able to serve your requests this quickly."
		);
		const isVisible = await errorMessageLocator.isVisible();
		if (isVisible) {
			await this.page.getByRole('link', { name: 'reload' }).click();
			await this.page.waitForLoadState('domcontentloaded');
		}
	}

	async fetchTimeLinks(maxLinks: number = 100): Promise<number[]> {
		const timesInMinutes: number[] = [];

		while (timesInMinutes.length < maxLinks) {
			const timeLinks = await this.page
				.getByRole('link')
				.filter({ hasText: /\d+ (minute|hour|day|year)(s)? ago/i })
				.all();

			const minutesArray = await this.extractMinutesFromLinks(timeLinks);
			timesInMinutes.push(
				...minutesArray.slice(0, maxLinks - timesInMinutes.length)
			);

			const moreLink = this.page.getByRole('link', { name: 'More' }).last();
			await this.page.waitForSelector('a:has-text("More")', { timeout: 10000 });

			if (moreLink && timesInMinutes.length < maxLinks) {
				await moreLink.click();
				await this.page.waitForTimeout(2000);
				await this.handleErrorMessage(); // Handle possible error after clicking "More"
			} else {
				break; // Exit if there are no more links
			}
		}
		return timesInMinutes;
	}

	private async extractMinutesFromLinks(
		timeLinks: Locator[]
	): Promise<number[]> {
		const timeConversion = {
			minute: 1,
			hour: 60,
			day: 1440,
		};

		const minutesArray = await Promise.all(
			timeLinks.map(async link => {
				const text = await link.textContent();
				const time = Number(text?.replace(/\D+/g, '') || '0');
				const periodMatch = text?.match(/(minute|hour|day|year)(s)? ago/i);
				const period = periodMatch ? periodMatch[1].toLowerCase() : null;
				return period ? time * timeConversion[period] : undefined;
			})
		);

		return minutesArray.filter(min => min !== undefined) as number[];
	}
}
