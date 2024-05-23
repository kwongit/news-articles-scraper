const logger = require("./logger");
const { chromium } = require("playwright");

/**
 * Scrapes articles from the specified Hacker News list URL.
 *
 * @param {string} listUrl - The URL of the Hacker News list to scrape articles from.
 * @param {number} numArticles - The number of articles to retrieve.
 * @param {string[]} keywords - An array of keywords to filter articles by title or URL.
 * @param {string} logFile - The file path for logging messages.
 * @returns {Promise<Object[]>} - A Promise that resolves to an array of article objects containing titles and URLs.
 * @throws {Error} - If an error occurs during scraping.
 */
async function scrapeArticles(listUrl, numArticles, keywords, logFile) {
  let browser;
  try {
    // Launch the browser in headless mode
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the constructed URL and perform scraping behavior
    await page.goto(listUrl);
    await logger(`Successfully navigated to: ${listUrl}`, logFile);

    // Get all article elements
    const articleElements = page.locator(".athing");
    const articleElementsCount = await articleElements.count();

    // Validate the number of articles
    if (numArticles > articleElementsCount) {
      numArticles = articleElementsCount;
      await logger(
        `Requested number of articles is greater than available articles. Adjusting number of articles to ${articleElementsCount}.`,
        logFile
      );
    }

    // Retrieve the titles and URLs of the top N articles
    const articles = [];
    for (let i = 0; i < numArticles; i++) {
      const article = articleElements.nth(i);
      const titleElement = article.locator(".titleline > a");
      const title = await titleElement.innerText();
      const url = await titleElement.getAttribute("href");

      // Validate that the title and URL are not empty
      if (title.trim() !== "" && url.trim() !== "") {
        const matchesKeyword =
          keywords.length === 0 ||
          keywords.some(
            (keyword) =>
              title.toLowerCase().includes(keyword.toLowerCase()) ||
              url.toLowerCase().includes(keyword.toLowerCase())
          );

        if (matchesKeyword) {
          articles.push({ title, url });
          await logger(
            `[${i + 1}/${numArticles}] Article retrieved: ${title}`,
            logFile
          );
        } else {
          await logger(
            `[${
              i + 1
            }/${numArticles}] Article skipped due to keyword filter: ${title}`,
            logFile
          );
        }
      } else {
        await logger(
          `[${
            i + 1
          }/${numArticles}] Skipping article due to missing title or URL.`,
          logFile
        );
      }
    }

    if (articles.length === 0) {
      await logger("No articles matched the provided keywords.", logFile);
    }

    return articles;
  } catch (error) {
    // Log any errors that occur
    await logger("An error occured: " + error.toString(), logFile);
    // Rethrow the error to be caught by the calling function
    throw error;
  } finally {
    // Close the browser after operations are complete or in case of an error
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = scrapeArticles;
