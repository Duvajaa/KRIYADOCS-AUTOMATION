# Kriyadocs Regression Automation

## Overview
This repository contains regression automation tests for the Kriyadocs project. The automation framework is built using Playwright version 1.42.1, providing robust and efficient testing capabilities.

## Prerequisites
Before running the automation tests, ensure that the following software is installed:

- Node.js v16.17.0
- Playwright v1.42.1

## Playwright
[Playwright](https://playwright.dev/docs/intro), developed by Microsoft, is a versatile automation testing framework designed for web applications. It supports various browsers such as Chromium, WebKit, and Firefox, ensuring comprehensive cross-browser testing capabilities. With a simple yet powerful API, Playwright enables developers to automate complex tasks with ease, including browser interactions and form submissions. Its support for multiple programming languages and advanced features like automatic waiting and network interception make it a preferred choice for building reliable and efficient automation tests.

## Setup
1. Clone this repository to your local machine.
2. Install the project dependencies by running the following command:
    ```bash
    npm install
    ```
3. Configure the necessary environment variables for your test environment.\

## Running Tests
To execute the regression automation tests, run the following command:
```bash
npx playwright test <file>
```

## View Report
To view the playwright HTML report, run the following command:
```bash
npx playwright show-report
```

