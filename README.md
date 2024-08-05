# hacker-news-playwright-tests

## Description

### Project Overview

A robust Playwright testing framework to validate the order of newly published articles on [Hacker News/newest](https://news.ycombinator.com/newest).

### Core Functionality

- **Validation of Article Order**: The primary function of this framework is to visit the [Hacker News/newest](https://news.ycombinator.com/newest) page and verify that the first 100 articles are correctly sorted by their publication time, from the newest to the oldest.
- **Cross-Browser Testing**: To ensure compatibility and reliability, the tests are executed across multiple browsers including Chrome, Firefox, and Mobile Safari. This helps in identifying any discrepancies or issues that might arise due to browser-specific rendering or behaviour.
- **Device Coverage**: The framework also includes testing on different devices, ensuring that the article order is validated not just on desktop browsers but also on mobile browsers, thereby covering a wider range of user scenarios.

### Docker Integration

The project is containerised using Docker, making it easy to set up and run the tests in a consistent environment:

- The Docker image for this project is [available on Docker Hub](https://hub.docker.com/repository/docker/mzcoder7/hacker-news-playwright-tests/), for smooth integration into CI/CD pipelines and simplifying the testing process.
- To ensure consistent reporting across all environments, I have used volume mapping to always store the latest html and json reports in the local `playwright-report` and `test-results` folders.

### Key Features

- **Automated Testing**: Fully automated tests using Playwright, reducing manual effort and increasing test coverage.
- **Cross-Browser Support**: Tests are executed on multiple browsers to ensure consistent user experience.
- **Mobile Testing**: Validations are extended to mobile browsers, covering a broad spectrum of user devices.
- **Dockerised Environment**: Easy setup and execution of tests using Docker, ensuring a consistent and isolated environment.

### Instructions

I have created custom scripts to make the framework easy to use.

Download or clone this repository, then there are 3 simple ways you can run the tests.

#### Option 1 - Docker container (headless mode):

For this option, make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running on your machine.

1. Pull the image from Docker Hub:
   `docker pull mzcoder7/hacker-news-playwright-tests`
2. Use Docker-compose to run tests in headless mode:
   `docker-compose up`
3. You will see a command in the terminal (after the run) that you can execute to view the latest report in the browser, or it will open automatically

![Docker run](/assets/Docker-run.png)

#### Option 2 - Playwright (headed mode)

1. From the root directory of this project, run `npm install` if you haven't already
2. Run `npm run test` to execute tests
3. You will see a similar command to option 1, or the report will open automatically.

![Playwright demo](/assets/Playwright-demo.gif)

#### Option 3 - Playwright UI (useful for debugging)

1. From the root directory of this project, run `npm install` if you haven't already
2. Run `npm run ui` to open the Playwright UI
3. From here you can experiment with the tests and try different browsers, devices, pause, rewind etc. This is a great tool for debugging/troubleshooting.

![UI demo](/assets/Playwright-UI.png)

---

### Clean Code & Performance Optimisation

Focussing on separation of concerns, I created a page object for the newest articles, to handle common behaviour:

- Navigation to the newest articles page
- Extracting time links and selecting 'more' until 100 valid links are found
- Converting the units to minutes (for comparison) and checking for null/invalid items
- Error handling and limiting the number of reloads

I found a common issue across certain devices (especially Android) where the requests for more articles seemed to overload Hacker News and/or were made too quickly:

![Error message](/assets/Error-message.png)

To troubleshoot this, I added dynamic waits where possible, and used a helper method for locating the error message & reloading.

![Error handling](/assets/Error-handling.png)

While this generally worked with 1 or 2 reloads, I would like to test this further on Android devices and other browsers before pushing more test cases to this repo.

As the framework grows, I can also extract common behaviour across the chrome, firefox and iphone specs (as well as other environments) into separate classes or methods.
