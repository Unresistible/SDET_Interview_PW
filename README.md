# Author: <b>Matsak Volodymyr</b>

# SDET Interview PlayWright project
<b>Description:</b> SDET Interview Technical Assessment: <i>Automate Product and Addon Addition to Cart using Playwright </i>

# Set up and run locally
* git clone
* npm ci
* npm i
* npm ci
* npm ci playwright
* Currently playwright run on two browsers:
  + npx playwright install chromium
  + npx playwright install webkit
* add .env file as in .env.template

# Run Playwright tests in UI mode:    
    npx playwright test --project=chromium --workers=2 --ui

//npx playwright test

//npx playwright show-trace path/to/trace.zip

# After run the generated HTML report is here

.\test-results-html\default\index.html