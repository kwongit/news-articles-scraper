# Hacker News Articles Scraper

This script allows you to scrape the top articles from Hacker News and save them in various formats such as CSV, JSON, Excel, or HTML. It includes features like data validation, progress indicators, logging, user interaction, and customizable output formats.

## Features

- **Scrapes top articles from Hacker News**
- **Supports multiple output formats: CSV, JSON, Excel, HTML**
- **Logs progress and errors**
- **Validates extracted data**
- **Interactive user prompts for configuration**
- **Customizable output file name and number of articles**
- **Command-line options for sorting, ordering, and keyword filtering**

## Dependencies

Ensure you have Node.js installed. The script uses the following npm packages:

- `playwright`: For web scraping.
- `json2csv`: For converting JSON data to CSV format.
- `prompt-sync`: For user input in the terminal.
- `xlsx`: For creating Excel files.
- `yargs`: For parsing command-line arguments
- `uuid`: For generating unique session identifiers

Install these dependencies by running:

```bash
npm install playwright json2csv prompt-sync xlsx yargs uuid
```

## Usage

1. **Clone the repository or download the script.**

2. **Install the necessary dependencies:**

   ```bash
   npm install
   ```

3. **Run the script:**

   ```bash
   node index.js [options]
   ```

4. **Follow the prompts to configure the script:**

   - Enter the number of articles to retrieve (default is 10).
   - Enter the file name (default is `top_10_articles`).
   - Enter the output format (`csv`, `json`, `xlsx`, `html`; default is `csv`).
   - Optionally, provide additional command-line options for sorting, ordering, and keyword filtering.

## Command-line Options

- `--sort`: Sort articles by specified field (title or url)
- `--order`: Sort order (asc or desc)
- `--keywords`: Comma-separated list of keywords to filter articles by title or URL
- `--list`: List to retrieve articles from (news, newest, front, etc.)

## Script Overview

### Constants

- `HACKER_NEWS_HOMEPAGE_URL`: URL of Hacker News homepage.
- `DEFAULT_FILE_NAME`: Default file name for the output.
- `DEFAULT_NUM_ARTICLES`: Default number of articles to retrieve.
- `LOG_FILE_NAME`: Log file name.
- `AVAILABLE_LISTS`: List of available lists on Hacker News.

### Logging

Logs messages to the console and a log file with timestamps.

### Data Validation

Ensures that the extracted titles and URLs are not empty.

### Output Formats

- **CSV**: Uses `json2csv` to convert JSON data to CSV.
- **JSON**: Writes JSON data directly to a file.
- **Excel**: Uses `xlsx` to create an Excel file.
- **HTML**: Generates a simple HTML file with a list of articles.

### User Interaction

Prompts the user for the number of articles, file name, and output format.

### Main Function

The main function `saveHackerNewsArticles` scrapes the articles and saves them in the specified format. It logs progress and handles errors.

## Modules

### 1. Main Script (`index.js`)

The main script orchestrates the workflow using other modules. It handles:

- Command-line arguments parsing.
- User interaction through prompts.
- Logging the script execution.
- Scraping articles from Hacker News.
- Filtering and sorting articles.
- Saving articles in the specified format.

### 2. Logger (`helpers/logger.js`)

Handles all logging functionalities.

- Logs messages to the console and optionally to a file.
- Each log entry includes a timestamp.

### 3. Scraper (`helpers/scraper.js`)

Manages web scraping using Playwright.

- Navigates to the specified Hacker News page.
- Retrieves the top N articles based on the provided criteria.
- Filters articles based on keywords.

### 4. Sorter (`helpers/sorter.js`)

Contains the sorting logic.

- Sorts articles based on the specified field and order (ascending or descending).

### 5. File Saver (`helpers/fileSaver.js`)

Handles saving data in different formats.

- `saveAsCSV`: Saves articles as a CSV file.
- `saveAsJSON`: Saves articles as a JSON file.
- `saveAsExcel`: Saves articles as an Excel file.
- `saveAsHTML`: Saves articles as an HTML file.

## Example

Running the script and following the prompts:

```bash
node index.js

Enter the number of articles to retrieve (default: 10): 5
Enter the file name (default: top_10_articles): top_articles
Enter the output format (csv, json, xlsx, html) (default: csv): json
```

The script will scrape the top 5 articles from Hacker News and save them in a file named `top_articles.json`.

## Additional Examples

Running the script with additional command-line options:

Retrieve articles sorted by title in descending order:

```bash
node index.js --sort=title --order=desc
```

Retrieve articles containing the keyword "github" from the "news" list:

```bash
node index.js --keywords=github --lists=news
```

## Above and Beyond

- **Modular Design**: Refactoring of the script into separate modules (logger, fileSaver, scraper, sorter) follows best practices in software engineering, enhancing the readability, maintainability, and testability of the code.
- **Advanced Features**: The additional features (sorting, filtering, multiple formats) show a deep understanding of potential user needs and provide a robust solution beyond the basic requirements.
- **Comprehensive Error Handling and Logging**: Ensuring that the script logs its progress and errors robustly is a professional touch that indicates the importance of monitoring and maintaining production scripts.
- **User Experience**: Including user prompts makes the script more flexible and user-friendly, demonstrating a focus on user experience.

## Conclusion

This script is a powerful tool for scraping and saving top articles from Hacker News in various formats. It is highly customizable, user-friendly, and logs its actions for easy troubleshooting and monitoring. With comprehensive documentation, users can easily understand and utilize the script for their needs.

<font color="gray">

## Future Enhancements

### Automated Tests

- **Unit Tests**: Ensure each module and function works correctly in isolation.
- **Integration Tests**: Verify that different parts of the system work together as expected.
- **End-to-End Tests**: Use Playwright to simulate real user interactions and validate the entire workflow from scraping to saving files.

### CI/CD Integration

- Set up a Continuous Integration/Continuous Deployment (CI/CD) pipeline (e.g., using GitHub Actions) to automatically run tests on each commit and ensure code quality.

### Configuration Management

- Use a configuration file (e.g., `config.json`) to manage default settings (like default number of articles, default file format, etc.), making the script more flexible and easier to configure.

### Error Notification

- Integrate a notification system (e.g., send an email or Slack message) if the script encounters an error, ensuring quick awareness and resolution of issues.

</font>
