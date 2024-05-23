// Documentation can be found in the new README.MD file

const { chromium } = require("playwright");
const { parse } = require("json2csv");
const path = require("path");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const xlsx = require("xlsx");
const yargs = require("yargs");
const { v4: uuidv4 } = require("uuid");

const HACKER_NEWS_HOMEPAGE_URL = "https://news.ycombinator.com";
const DEFAULT_FILE_NAME = "top_10_articles";
const DEFAULT_NUM_ARTICLES = 10;
const LOG_FILE_NAME = "script_logs.txt";

// Define the available lists on Hacker News
const AVAILABLE_LISTS = [
  null,
  "news",
  "newest",
  "front",
  "ask",
  "show",
  "jobs",
  "pool",
  "invited",
  "shownew",
  "asknew",
  "best",
  "active",
  "noobstories",
  "classic",
  "submitted?id=whoishiring",
  "launches",
];

// FEATURE: COMMAND-LINE ARGUMENTS FOR SORTING & ORDERING
const argv = yargs
  .option("sort", {
    describe: "Sort articles by specified field (title or url)",
    type: "string",
    default: null,
  })
  .option("order", {
    describe: "Sort order (asc or desc)",
    type: "string",
    default: null,
  })
  .option("keywords", {
    describe:
      "Comma-separated list of keywords to filter articles by title or URL",
    type: "string",
    default: null,
  })
  .option("list", {
    describe: "List to retrieve articles from (news, newest, front, etc.)",
    type: "string",
    choices: AVAILABLE_LISTS,
    default: null,
    defaultDescription: "Hacker News homepage",
  })
  .help()
  .alias("help", "h").argv;

// Set default value of "order" based on whether "sort" is provided or not
if (argv.sort && !argv.order) {
  // Default to ascending order if "sort" is provided but "order" is not
  argv.order = "asc";
}

// FEATURE: LOGGING
async function logger(message, filePath) {
  // Create timestamp in ISO format (uses UTC timezone)
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  if (filePath) {
    try {
      await fs.promises.appendFile(filePath, `${formattedMessage}\n`);
    } catch (error) {
      console.error("Error writing to log file:", error);
    }
  }
}

// Sort function based on specified criteria and direction
function sortArticles(articles, sortField, sortOrder) {
  return articles.sort((a, b) => {
    const fieldA = a[sortField].toLowerCase();
    const fieldB = b[sortField].toLowerCase();
    if (sortOrder === "asc") {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });
}

// Function to save articles as CSV
function saveAsCSV(articles, filePath) {
  const csv = parse(articles);
  fs.writeFileSync(filePath, csv);
}

// Function to save articles as JSON
function saveAsJSON(articles, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
}

// Function to save articles as Excel
function saveAsExcel(articles, filePath) {
  const worksheet = xlsx.utils.json_to_sheet(articles);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Articles");
  xlsx.writeFile(workbook, filePath);
}

// Function to save articles as HTML
function saveAsHTML(articles, filePath) {
  const htmlContent = `
    <html>
      <head>
        <title>Top Articles</title>
      </head>
      <body>
        <h1>Top Articles</h1>
        <ul>
          ${articles
            .map(
              (article) =>
                `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`
            )
            .join("")}
        </ul>
      </body>
    </html>
  `;
  fs.writeFileSync(filePath, htmlContent);
}

// FEATURE: PARAMETERIZATION AND FILE CUSTOMIZATION
async function saveHackerNewsArticles(
  numArticles = DEFAULT_NUM_ARTICLES,
  fileName = DEFAULT_FILE_NAME,
  outputFormat = "csv",
  logFile = LOG_FILE_NAME,
  sortField = null,
  sortOrder = null,
  keywords = []
) {
  let browser;
  // FEATURE: ERROR HANDLING
  try {
    // Launch the browser in headless mode
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Construct the URL based on the selected list or default to homepage
    // If a list is provided, construct the URL accordingly; otherwise, default to the homepage URL
    const listUrl = argv.list
      ? `${HACKER_NEWS_HOMEPAGE_URL}/${argv.list}`
      : HACKER_NEWS_HOMEPAGE_URL;

    // Navigate to the constructed URL and perform scraping behavior
    await page.goto(listUrl);
    await logger(`Successfully navigated to: ${listUrl}`, logFile);

    // Get all article elements
    const articleElements = page.locator(".athing");

    // Validate the number of articles
    const articleElementsCount = await articleElements.count();
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

      // FEATURE: DATA VALIDATION
      // Validate that the title and URL are not empty
      if (title.trim() !== "" && url.trim() !== "") {
        // FEATURE: KEYWORD FILTERING
        const matchesKeyword =
          keywords.length === 0 ||
          keywords.some(
            (keyword) =>
              title.toLowerCase().includes(keyword.toLowerCase()) ||
              url.toLowerCase().includes(keyword.toLowerCase())
          );

        if (matchesKeyword) {
          articles.push({ title, url });
          // FEATURE: PROGRESS INDICATOR FOR SCRIPT EXECUTION
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
    } else {
      // Sort articles based on specified criteria and direction if provided
      if (sortField && sortOrder) {
        articles.sort((a, b) => {
          const fieldA = a[sortField].toLowerCase();
          const fieldB = b[sortField].toLowerCase();
          if (sortOrder === "asc") {
            return fieldA.localeCompare(fieldB);
          } else {
            return fieldB.localeCompare(fieldA);
          }
        });
      }

      // Create the appropriate output file
      const filePath = path.join(__dirname, `${fileName}.${outputFormat}`);

      // Save in the specified format
      switch (outputFormat.toLowerCase()) {
        case "csv":
          saveAsCSV(articles, filePath);
          break;
        case "json":
          saveAsJSON(articles, filePath);
          break;
        case "xlsx":
          saveAsExcel(articles, filePath);
          break;
        case "html":
          saveAsHTML(articles, filePath);
          break;
        default:
          // Throw an error if the output format is not supported
          throw new Error("Unsupported output format");
      }

      await logger(
        `Top ${numArticles} articles saved to: ${filePath}`,
        logFile
      );
    }
  } catch (error) {
    // Log any errors that occur
    await logger("An error occured: " + error.toString(), logFile);
  } finally {
    // Close the browser after operations are complete or in case of an error
    if (browser) {
      await browser.close();
    }
  }
}

// IIFE to execute the script
(async () => {
  // Create the log file
  const logFilePath = path.join(__dirname, LOG_FILE_NAME);

  // Log the beginning of script execution
  const sessionUID = uuidv4();
  await logger(
    `Start of script execution.\nSession UID: ${sessionUID}`,
    logFilePath
  );

  // FEATURE: USER INTERACTION
  const numArticlesInput = `Enter the number of articles to retrieve (default: ${DEFAULT_NUM_ARTICLES}): `;
  const numArticles =
    parseInt(prompt(numArticlesInput)) || DEFAULT_NUM_ARTICLES;

  const fileNameInput = `Enter the CSV file name (default: ${DEFAULT_FILE_NAME}): `;
  const fileName = prompt(fileNameInput) || DEFAULT_FILE_NAME;

  const outputFormatInput = `Enter the output format (csv, json, xlsx, html) (default: csv): `;
  const outputFormat = prompt(outputFormatInput) || "csv";

  // Check if additional sorting options are provided
  if (argv.sort && argv.order) {
    await logger(
      `Sorting articles by ${argv.sort} in ${argv.order} order...`,
      logFilePath
    );
  }

  const keywords = argv.keywords ? argv.keywords.split(",") : [];
  if (keywords.length > 0) {
    await logger(
      `Filtering articles with keywords: ${keywords.join(", ")}`,
      logFilePath
    );
  }

  // Execute the script
  await saveHackerNewsArticles(
    numArticles,
    fileName,
    outputFormat,
    logFilePath,
    argv.sort,
    argv.order,
    keywords
  );

  // Log the ending of script execution
  await logger(`End of script execution.\n`, logFilePath);
})();
