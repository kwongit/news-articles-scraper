const scrapeArticles = require("../../helpers/scraper");
const logger = require("../../helpers/logger");
const { chromium } = require("playwright");

// Mock logger module;
jest.mock("../../helpers/logger");

describe("scrapeArticles", () => {
  // Define test data
  const listUrl = "https://example.com";
  const numArticles = 3;
  const keywordsMatch = ["article", "example"];
  const keywordsNonMatch = ["technology", "science"];
  const keywordsEmpty = [];
  const logFile = "test_logs.log";

  // Mock playwright functions before each test
  beforeEach(() => {
    // Mock chromium launch function
    chromium.launch = jest.fn(() => ({
      // Mock newContext function
      newContext: jest.fn(() => ({
        // Mock newPage function
        newPage: jest.fn(() => ({
          // Mock goto function
          goto: jest.fn(),
          // Mock locator function
          locator: jest.fn(() => ({
            // Mock count function to return number of articles
            count: jest.fn(() => numArticles),
            // Mock nth function to return article elements
            nth: jest.fn((index) => ({
              // Mock locator function for article elements
              locator: jest.fn(() => ({
                // Mock innerText function for article title
                innerText: jest.fn(() => `Article ${index + 1}`),
                // Mock getAttribute function for article URL
                getAttribute: jest.fn(
                  () => `https://example.com/article${index + 1}`
                ),
              })),
            })),
          })),
        })),
      })),
      // Mock close function for browser
      close: jest.fn(),
    }));
  });

  it("should log successful navigation and scrape articles matching keywords", async () => {
    const articles = await scrapeArticles(
      listUrl,
      numArticles,
      keywordsMatch,
      logFile
    );

    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining("Successfully navigated to"),
      logFile
    );

    expect(articles).toEqual([
      { title: "Article 1", url: "https://example.com/article1" },
      { title: "Article 2", url: "https://example.com/article2" },
      { title: "Article 3", url: "https://example.com/article3" },
    ]);
  });

  it("should handle when no articles match the provided keywords", async () => {
    const articles = await scrapeArticles(
      listUrl,
      numArticles,
      keywordsNonMatch,
      logFile
    );

    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining("Successfully navigated to"),
      logFile
    );

    expect(articles).toEqual([]);
  });

  it("should scrape all articles when keywords are empty", async () => {
    const articles = await scrapeArticles(
      listUrl,
      numArticles,
      keywordsEmpty,
      logFile
    );

    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining("Successfully navigated to"),
      logFile
    );

    expect(articles.length).toBe(numArticles);
  });

  it("should handle errors during scraping", async () => {
    const errorMessage = "Failed to scrape articles";
    // Mock the chromium.launch function to throw an error for error handling test
    chromium.launch = jest.fn(() => {
      throw new Error(errorMessage);
    });

    await expect(
      scrapeArticles(listUrl, numArticles, keywordsEmpty, logFile)
    ).rejects.toThrow(errorMessage);
  });
});
