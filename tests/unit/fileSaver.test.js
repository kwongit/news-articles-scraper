const fs = require("fs");
const xlsx = require("xlsx");
const { saveAsCSV } = require("../../helpers/fileSaver");
const { saveAsJSON } = require("../../helpers/fileSaver");
const { saveAsExcel } = require("../../helpers/fileSaver");

describe("fileSaver", () => {
  it("should save articles as CSV", () => {
    const articles = [
      { title: "Article 1", url: "http://example.com/article1" },
      { title: "Article 2", url: "http://example.com/article2" },
    ];
    const filePath = "test_articles.csv";

    saveAsCSV(articles, filePath);

    const fileContent = fs.readFileSync(filePath, "utf-8");

    expect(fileContent).toContain("Article 1", "http://example.com/article1");
    expect(fileContent).toContain("Article 2", "http://example.com/article2");

    fs.unlinkSync(filePath);
  });

  it("should save articles as JSON", () => {
    const articles = [
      { title: "Article 1", url: "http://example.com/article1" },
      { title: "Article 2", url: "http://example.com/article2" },
    ];
    const filePath = "test_articles.json";

    saveAsJSON(articles, filePath);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent);

    expect(parsedData).toEqual(articles);

    fs.unlinkSync(filePath);
  });

  it("should save articles as Excel", () => {
    const articles = [
      { title: "Article 1", url: "http://example.com/article1" },
      { title: "Article 2", url: "http://example.com/article2" },
    ];
    const filePath = "test_articles.xlsx";

    saveAsExcel(articles, filePath);

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets["Articles"];
    const cellA2 = worksheet.A2.v;
    const cellB2 = worksheet.B2.v;
    const cellA3 = worksheet.A3.v;
    const cellB3 = worksheet.B3.v;

    expect(cellA2).toBe("Article 1");
    expect(cellB2).toBe("http://example.com/article1");
    expect(cellA3).toBe("Article 2");
    expect(cellB3).toBe("http://example.com/article2");

    fs.unlinkSync(filePath);
  });
});
