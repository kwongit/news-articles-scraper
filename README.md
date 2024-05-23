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

## Conclusion

This script is a powerful tool for scraping and saving top articles from Hacker News in various formats. It is highly customizable, user-friendly, and logs its actions for easy troubleshooting and monitoring. With comprehensive documentation, users can easily understand and utilize the script for their needs.
