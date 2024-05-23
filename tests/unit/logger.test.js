const fs = require("fs");
const logger = require("../../helpers/logger");

describe("logger", () => {
  afterEach(() => {
    // Clear all mocks after each test to ensure no test interference
    jest.clearAllMocks();
  });

  it("should log message to console", async () => {
    // Mock the console.log function
    console.log = jest.fn();
    await logger("Test message");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Test message")
    );
  });

  it("should log message to file when file path is provided", async () => {
    // Create a mock function for fs.promises.appendFile
    const mockAppendFile = jest.fn();
    // Spy on fs.promises.appendFile and replace it with the mock function
    jest.spyOn(fs.promises, "appendFile").mockImplementation(mockAppendFile);

    await logger("Test message", "test_logs.log");

    expect(mockAppendFile).toHaveBeenCalledWith(
      "test_logs.log",
      expect.stringContaining("Test message")
    );
  });

  it("should handle errors when writing to log file fails", async () => {
    // Spy on fs.promises.appendFile and make it reject with an error
    jest
      .spyOn(fs.promises, "appendFile")
      .mockRejectedValue(new Error("Error writing to log file:"));
    // Mock the console.error function
    console.error = jest.fn();

    await logger("Test message", "test_logs.log");

    expect(console.error).toHaveBeenCalledWith(
      "Error writing to log file:",
      expect.any(Error)
    );
  });

  it("should only log to console when no file path is provided", async () => {
    // Mock the console.log function
    console.log = jest.fn();
    // Create a mock function for fs.promises.appendFile
    const mockAppendFile = jest.fn();
    // Spy on fs.promises.appendFile and replace it with the mock function
    jest.spyOn(fs.promises, "appendFile").mockImplementation(mockAppendFile);

    await logger("Test message");

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Test message")
    );
    expect(mockAppendFile).not.toHaveBeenCalled();
  });
});
