const { parse } = require("json2csv");
const fs = require("fs");
const xlsx = require("xlsx");

/**
 * Converts the articles into CSV format and saves them to a file.
 * @param {Array} articles - The array of articles to be saved.
 * @param {string} filePath - The file path where the CSV file will be saved.
 */
function saveAsCSV(articles, filePath) {
  const csv = parse(articles);
  fs.writeFileSync(filePath, csv);
}

/**
 * Converts the articles into JSON format and saves them to a file.
 * @param {Array} articles - The array of articles to be saved.
 * @param {string} filePath - The file path where the JSON file will be saved.
 */
function saveAsJSON(articles, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
}

/**
 * Converts the articles into Excel format and saves them to a file.
 * @param {Array} articles - The array of articles to be saved.
 * @param {string} filePath - The file path where the Excel file will be saved.
 */
function saveAsExcel(articles, filePath) {
  const worksheet = xlsx.utils.json_to_sheet(articles);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Articles");
  xlsx.writeFile(workbook, filePath);
}

/**
 * Constructs an HTML representation of the articles and saves it to a file.
 * @param {Array} articles - The array of articles to be saved.
 * @param {string} filePath - The file path where the HTML file will be saved.
 */
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

module.exports = { saveAsCSV, saveAsJSON, saveAsExcel, saveAsHTML };
