const sortArticles = require("../../helpers/sorter");

describe("sortArticles", () => {
  it("should sort articles in ascending order based on the specified field", () => {
    const articles = [
      { title: "Article C", url: "https://example.com/c" },
      { title: "Article A", url: "https://example.com/a" },
      { title: "Article B", url: "https://example.com/b" },
    ];

    const sortedArticles = sortArticles(articles, "title", "asc");

    expect(sortedArticles).toEqual([
      { title: "Article A", url: "https://example.com/a" },
      { title: "Article B", url: "https://example.com/b" },
      { title: "Article C", url: "https://example.com/c" },
    ]);
  });

  it("should sort articles in descending order based on the specified field", () => {
    const articles = [
      { title: "Article C", url: "https://example.com/c" },
      { title: "Article A", url: "https://example.com/a" },
      { title: "Article B", url: "https://example.com/b" },
    ];

    const sortedArticles = sortArticles(articles, "title", "desc");

    expect(sortedArticles).toEqual([
      { title: "Article C", url: "https://example.com/c" },
      { title: "Article B", url: "https://example.com/b" },
      { title: "Article A", url: "https://example.com/a" },
    ]);
  });
});
