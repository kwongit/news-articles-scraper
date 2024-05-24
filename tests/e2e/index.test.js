const prompt = require("prompt-sync")();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// Mocking prompt-sync module
jest.mock("prompt-sync", () => {
  return jest.fn().mockImplementation(() => jest.fn());
});

const DEFAULT_NUM_ARTICLES = 10;
const DEFAULT_FILE_NAME = "top_10_articles";

// Test suite for command-line parsing
describe("Command-line parsing", () => {
  it("should parse command-line arguments correctly", () => {
    // Test different scenarios for sort and order arguments
    const testCases = [
      {
        args: ["--_", "", "--sort", "title", "--order", "desc"],
        sort: "title",
        order: "desc",
      },
      {
        args: ["--_", "", "--sort", "title", "--order", "asc"],
        sort: "title",
        order: "asc",
      },
      {
        args: ["--_", "", "--sort", "url", "--order", "desc"],
        sort: "url",
        order: "desc",
      },
      {
        args: ["--_", "", "--sort", "url", "--order", "asc"],
        sort: "url",
        order: "asc",
      },
      { args: [], sort: undefined, order: undefined }, // Test default values
    ];

    // Iterate through test cases
    testCases.forEach((testCase) => {
      const argv = yargs(hideBin(testCase.args)).argv;
      expect(argv.sort).toBe(testCase.sort);
      expect(argv.order).toBe(testCase.order);
    });
  });
});

// Test suite for user input prompting
describe("User input prompting", () => {
  // Test valid input
  it("should accept valid input for the number of articles", () => {
    prompt.mockReturnValueOnce("15");

    const numArticles =
      parseInt(
        prompt(
          `Enter the number of articles to retrieve (default: ${DEFAULT_NUM_ARTICLES}): `
        )
      ) || DEFAULT_NUM_ARTICLES;

    expect(numArticles).toBe(15);
  });

  // Test empty input (should use default)
  it("should prompt user for number of articles and use default if not provided", () => {
    // Mocking user input for empty input (should use default)
    prompt.mockReturnValueOnce("");

    const numArticles =
      parseInt(
        prompt(
          `Enter the number of articles to retrieve (default: ${DEFAULT_NUM_ARTICLES}): `
        )
      ) || DEFAULT_NUM_ARTICLES;

    expect(numArticles).toBe(DEFAULT_NUM_ARTICLES);
  });

  // Test invalid input (non-numeric)
  it("should handle invalid input for the number of articles", () => {
    prompt.mockReturnValueOnce("invalid");

    const numArticles =
      parseInt(
        prompt(
          `Enter the number of articles to retrieve (default: ${DEFAULT_NUM_ARTICLES}): `
        )
      ) || DEFAULT_NUM_ARTICLES;

    expect(numArticles).toBe(DEFAULT_NUM_ARTICLES);
  });

  // Test valid input for file name
  it("should accept valid input for the file name", () => {
    prompt.mockReturnValueOnce("custom_filename");

    const fileName =
      prompt(`Enter the file name (default: ${DEFAULT_FILE_NAME}): `) ||
      DEFAULT_FILE_NAME;

    expect(fileName).toBe("custom_filename");
  });

  // Test empty input for file name (should use default)
  it("should prompt user for file name and use default if not provided", () => {
    prompt.mockReturnValueOnce("");

    const fileName =
      prompt(`Enter the file name (default: ${DEFAULT_FILE_NAME}): `) ||
      DEFAULT_FILE_NAME;

    expect(fileName).toBe(DEFAULT_FILE_NAME);
  });

  // Test valid input for output format
  it("should accept valid input for the output format", () => {
    prompt.mockReturnValueOnce("json");

    const outputFormat =
      prompt(`Enter the output format (csv, json, xlsx) (default: csv): `) ||
      "csv";

    expect(outputFormat).toBe("json");
  });

  // Test empty input for output format (should use default)
  it("should prompt user for output format and use default if not provided", () => {
    prompt.mockReturnValueOnce("");

    const outputFormat =
      prompt(`Enter the output format (csv, json, xlsx) (default: csv): `) ||
      "csv";

    expect(outputFormat).toBe("csv");
  });
});
