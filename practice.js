const { context } = await launch({ headless: false });
const page = await context.newPage();

// launch browser and go to Netflix
// await page.goto('https://netflix.com');

// // go to the sign in page
// await page.locator(`#signIn`).click();

// // fill in invalid crede
// await page.locator(`[name="userLoginId"]`).fill(`wrongemail@email.com`);
// await page.locator(`[name="password"]`).fill(`password`);

// // try to sign in
// await page.locator(`[type="submit"]`).click();

// // assert that we cannot log in
// await expect(page.locator('text=Incorrect password for wrongemail@email.com')).toBeVisible();

// go to Hacker News
await page.goto("https://news.ycombinator.com/");

// locate article elements
const articleElements = page.locator(`.titleline > a`);

// get article elements count
const articleElementsCount = await articleElements.count();
// console.log('article elements: ', articleElements);
// console.log('article elements count: ', articleElementsCount);

// assert article elements count
expect(articleElementsCount).toBe(30);

// create empty articles list
const articles = [];

// loop through the first 10 elements of article elements
for (let i = 0; i < 10; i++) {
  // index into first article element
  const article = articleElements.nth(i);
  // get inner text of article element title tag
  const title = await article.innerText();
  // get href of article element title tag
  const url = await article.getAttribute("href");

  // push {title, url} object to articles list
  articles.push({ title, url });
}

// console.log('articles: ', articles);
// console.log('');

// loop through articles list and console log each article
articles.forEach((article) => {
  console.log("article: ", article);
});

// console.log('articles length: ', articles.length);

// assert articles list length
expect(articles.length).toBe(10);
