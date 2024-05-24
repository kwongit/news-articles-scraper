/**
 * Orchestrates the workflow of retrieving, sorting, and saving Hacker News articles.
 *
 * This script retrieves Hacker News articles based on user input or default configurations, sorts them if sorting options are provided, saves them in the specified output format, and logs the execution process.
 *
 * @module MainScript
 */

const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });
const yargs = require("yargs");
const { v4: uuidv4 } = require("uuid");

const logger = require("./helpers/logger");
const { saveAsCSV, saveAsJSON, saveAsExcel } = require("./helpers/fileSaver");
const scrapeArticles = require("./helpers/scraper");
const sortArticles = require("./helpers/sorter");

const HACKER_NEWS_HOMEPAGE_URL = "https://news.ycombinator.com";
const DEFAULT_FILE_NAME = "top_10_articles";
const DEFAULT_NUM_ARTICLES = 10;
const LOG_FILE_NAME = "script_logs.log";

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

// IIFE to execute the script
(async () => {
  // Create the log file
  const logFilePath = path.join(__dirname, LOG_FILE_NAME);

  // Log the beginning of script execution with UID
  const sessionUID = uuidv4();
  await logger(
    `Start of script execution.\n[Session UID]: ${sessionUID}`,
    logFilePath
  );

  const numArticlesInput = `Enter the number of articles to retrieve (default: ${DEFAULT_NUM_ARTICLES}): `;
  const numArticles =
    parseInt(prompt(numArticlesInput)) || DEFAULT_NUM_ARTICLES;

  const fileNameInput = `Enter the file name (default: ${DEFAULT_FILE_NAME}): `;
  const fileName = prompt(fileNameInput) || DEFAULT_FILE_NAME;

  const outputFormatInput = `Enter the output format (csv, json, xlsx) (default: csv): `;
  const outputFormat = prompt(outputFormatInput) || "csv";

  // Check if additional sorting options are provided
  if (argv.sort && argv.order) {
    await logger(
      `Sorting articles by ${argv.sort} in ${argv.order} order...`,
      logFilePath
    );
  }

  // Check if additional keyword options are provided
  const keywords = argv.keywords ? argv.keywords.split(",") : [];
  if (keywords.length > 0) {
    await logger(
      `Filtering articles with keywords: ${keywords.join(", ")}`,
      logFilePath
    );
  }

  try {
    // Construct the URL based on the selected list or default to homepage
    // If a list is provided, construct the URL accordingly; otherwise, default to the homepage URL
    const listUrl = argv.list
      ? `${HACKER_NEWS_HOMEPAGE_URL}/${argv.list}`
      : HACKER_NEWS_HOMEPAGE_URL;

    const articles = await scrapeArticles(
      listUrl,
      numArticles,
      keywords,
      logFilePath
    );

    // Check if additional sorting options are provided
    if (argv.sort && argv.order) {
      sortArticles(articles, argv.sort, argv.order);
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
      default:
        // Throw an error if the output format is not supported
        throw new Error("Unsupported output format");
    }

    await logger(
      `Top ${numArticles} articles saved to: ${filePath}`,
      logFilePath
    );
  } catch (error) {
    await logger("An error occurred: " + error.toString(), logFilePath);
  } finally {
    // Log the ending of script execution
    await logger(`End of script execution.\n`, logFilePath);
  }
})();

// TODO:
// complete assignment 2 - video recording
// convert to TS
