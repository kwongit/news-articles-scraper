const fs = require("fs");
const { chromium } = require("playwright");
const scrapeArticles = require("../../helpers/scraper");
const { saveAsCSV } = require("../../helpers/fileSaver");
const logger = require("../../helpers/logger");

// Mock logger to avoid actual logging during tests
jest.mock("../../helpers/logger");

describe("End-to-end", () => {
  const filePath = "./top_10_articles.csv";

  afterEach(() => {
    // Clean up the generated CSV file after each test
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  it("should scrape articles and save to CSV", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://news.ycombinator.com");
    const articles = await scrapeArticles(
      "https://news.ycombinator.com",
      10,
      [],
      "test.log"
    );

    saveAsCSV(articles, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    await browser.close();
  });

  it("should scrape articles with keyword matching and save to CSV", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://news.ycombinator.com");
    const articles = await scrapeArticles(
      "https://news.ycombinator.com",
      10,
      ["github", "io", "ai", "info", "com", "dev"],
      "test.log"
    );

    saveAsCSV(articles, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    await browser.close();
  });

  it("should handle no articles matching the provided keywords", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://news.ycombinator.com");
    const articles = await scrapeArticles(
      "https://news.ycombinator.com",
      10,
      ["nonexistentkeyword"],
      "test.log"
    );

    expect(articles).toEqual([]);

    expect(fs.existsSync(filePath)).toBe(false);

    await browser.close();
  });

  it("should handle errors during scraping", async () => {
    const invalidUrl = "https://invalid-url.com";
    await expect(
      scrapeArticles(invalidUrl, 10, [], "test.log")
    ).rejects.toThrow();

    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("should verify content of the CSV file", async () => {
    const numArticles = 10;
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://news.ycombinator.com");
    const articles = await scrapeArticles(
      "https://news.ycombinator.com",
      numArticles,
      [],
      "test.log"
    );

    saveAsCSV(articles, filePath);

    const csvContent = fs.readFileSync(filePath, "utf8");
    const rows = csvContent.trim().split("\n");
    const expectedHeaders = `"title","url"`;

    expect(csvContent.startsWith(expectedHeaders)).toBe(true);
    expect(rows.length).toBe(numArticles + 1);

    await browser.close();
  });
});
