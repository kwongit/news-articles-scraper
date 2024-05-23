const fs = require("fs");
const logger = require("../../helpers/logger");

describe("logger", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log message to console", async () => {
    console.log = jest.fn();
    await logger("Test message");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Test message")
    );
  });

  it("should log message to file when file path is provided", async () => {
    const mockAppendFile = jest.fn();
    jest.spyOn(fs.promises, "appendFile").mockImplementation(mockAppendFile);

    await logger("Test message", "test_logs.log");

    expect(mockAppendFile).toHaveBeenCalledWith(
      "test_logs.log",
      expect.stringContaining("Test message")
    );
  });

  it("should handle errors when writing to log file fails", async () => {
    jest
      .spyOn(fs.promises, "appendFile")
      .mockRejectedValue(new Error("Error writing to log file:"));
    console.error = jest.fn();

    await logger("Test message", "test_logs.log");

    expect(console.error).toHaveBeenCalledWith(
      "Error writing to log file:",
      expect.any(Error)
    );
  });

  it("should only log to console when no file path is provided", async () => {
    console.log = jest.fn();
    const mockAppendFile = jest.fn();
    jest.spyOn(fs.promises, "appendFile").mockImplementation(mockAppendFile);

    await logger("Test message");

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Test message")
    );
    expect(mockAppendFile).not.toHaveBeenCalled();
  });
});
