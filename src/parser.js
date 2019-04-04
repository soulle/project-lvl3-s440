const parser = new DOMParser();

export default (data) => {
  const dom = parser.parseFromString(data, 'application/xml');

  const feedTitle = dom.querySelector('title').textContent;
  const feedDescription = dom.querySelector('description').textContent;
  const articles = [...dom.querySelectorAll('item')].map((item) => {
    const articleLink = item.querySelector('link').innerHTML;
    const articleTitle = item.querySelector('title').textContent;
    const articleDescription = item.querySelector('description').textContent;
    return { articleLink, articleTitle, articleDescription };
  });
  // console.log('articles'. articles);
  return { feedTitle, feedDescription, articles };
};
