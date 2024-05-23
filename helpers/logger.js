const fs = require("fs");

/**
 * Logs a message to the console and optionally appends it to a log file.
 *
 * @param {string} message - The message to be logged.
 * @param {string} [filePath] - The file path to append the log message to (optional).
 * @returns {Promise<void>} - A Promise that resolves once the logging operation is complete.
 */
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

module.exports = logger;
