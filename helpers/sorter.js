/**
 * Sorts the articles array based on the specified field and sort order.
 * @param {Array} articles - The array of articles to be sorted.
 * @param {string} sortField - The field based on which the articles will be sorted (e.g., 'title', 'url').
 * @param {string} sortOrder - The sort order ('asc' for ascending, 'desc' for descending).
 * @returns {Array} - The sorted array of articles.
 */
function sortArticles(articles, sortField, sortOrder) {
  return articles.sort((a, b) => {
    const fieldA = a[sortField].toLowerCase();
    const fieldB = b[sortField].toLowerCase();
    if (sortOrder === "asc") {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });
}

module.exports = sortArticles;
