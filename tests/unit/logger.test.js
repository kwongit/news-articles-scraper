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
});
