# hacker-news-playwright-tests

## Table of Contents

- [Description](#description)
  - [Project Overview](#project-overview)
  - [Core Functionality](#core-functionality)
- [Docker Integration](#docker-integration)
- [Key Features](#key-features)
- [Instructions](#instructions)
  - [Option 1 - Docker container (headless mode)](#option-1---docker-container-headless-mode)
  - [Option 2 - Playwright (headed mode)](#option-2---playwright-headed-mode)
  - [Option 3 - Playwright UI (useful for debugging)](#option-3---playwright-ui-useful-for-debugging)
- [Clean Code & Performance Optimisation](#clean-code--performance-optimisation)

## Description

### Project Overview

A robust Playwright testing framework to validate the order of newly published articles on [Hacker News/newest](https://news.ycombinator.com/newest).

### Core Functionality

- **Validation of Article Order**: The primary function of this framework is to visit the [Hacker News/newest](https://news.ycombinator.com/newest) page and verify that the first 100 articles are correctly sorted by their publication time, from the newest to the oldest.
- **Cross-Browser Testing**: To ensure compatibility and reliability, the tests are executed across multiple browsers including Chrome, Firefox, and Mobile Safari. This helps in identifying any discrepancies or issues that might arise due to browser-specific rendering or behaviour.
- **Device Coverage**: The framework also includes testing on different devices, ensuring that the article order is validated not just on desktop browsers but also on mobile browsers, thereby covering a wider range of user scenarios.

## Docker Integration

The project is containerised using Docker, making it easy to set up and run the tests in a consistent environment:

- The Docker image for this project is [available on Docker Hub](https://hub.docker.com/repository/docker/mzcoder7/hacker-news-playwright-tests/), for smooth integration into CI/CD pipelines and simplifying the testing process.
- To ensure consistent reporting across all environments, I have used **volume mapping** to always store the latest HTML and JSON reports in the local `playwright-report` and `test-results` folders.

## Key Features

- **Automated Testing**: Fully automated tests using Playwright, reducing manual effort and increasing test coverage.
- **Cross-Browser Support**: Tests are executed on multiple browsers to ensure consistent user experience.
- **Mobile Testing**: Validations are extended to mobile browsers, covering a broad spectrum of user devices.
- **Dockerised Environment**: Easy setup and execution of tests using Docker, ensuring a consistent and isolated environment.

## Instructions

I have created custom scripts to make the framework easy to use.

Download or clone this repository, then go to where it has been stored on your machine.

There are 3 simple ways you can run the tests.

### Option 1 - Docker container (headless mode):

For this option, make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running on your machine.

1. From the root directory of this project, pull the image from Docker Hub:

```Shell
   docker pull mzcoder7/hacker-news-playwright-tests
```

2. Use Docker-compose to run tests on a container in headless mode:

```Shell
   docker-compose up
```

3. You will see a command in the terminal (after the run) that you can execute to view the latest report in the browser, or it will open automatically

   ![Docker run](/assets/Docker-run.png)

### Option 2 - Playwright (headed mode)

1. From the root directory of this project, install dependencies if needed:

```Shell
   npm install
```

2. Run tests in headed mode on your machine:

```Shell
   npm run test
```

3. You will see a command in the terminal (after the run) that you can execute to view the latest report in the browser, or it will open automatically

   ![Playwright demo](/assets/Playwright-demo.gif)

### Option 3 - Playwright UI (useful for debugging)

1. From the root directory of this project, install dependencies if needed:

```Shell
npm install
```

2. Open the playwright UI:

```Shell
npm run ui
```

3. From here you can experiment with the tests and try different browsers, devices, pause, rewind etc. This is a great tool for debugging/troubleshooting.

   ![UI demo](/assets/Playwright-UI.png)

---

## Clean Code & Performance Optimisation

Focussing on separation of concerns, I created a page object for the newest articles, to handle common behaviour:

- Navigation to the newest articles page
- Extracting time links and selecting 'more' until 100 valid links are found
- Converting the units to minutes (for comparison) and checking for null/invalid items
- Error handling and limiting the number of reloads

I found a common issue across certain devices (especially Android) where the requests for more articles seemed to overload Hacker News and/or were made too quickly:

![Error message](/assets/Error-message.png)

To troubleshoot this, I added dynamic waits where possible, and used a helper method for locating the error message & clicking the 'reload' element.

![Error handling](/assets/Error-handling.png)

- While this generally worked with 1 or 2 reloads, I would like to test this further on Android devices and other browsers before pushing more test cases to this repo.
- As the framework grows, I can also extract common behaviour across the chrome, firefox and iphone specs (as well as other environments) into separate classes or methods.
