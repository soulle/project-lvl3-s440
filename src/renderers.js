const addFeedsPart = (data) => {
  const feedsPart = document.querySelector('div.feeds-group');

  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;

  const divFeed = document.createElement('div');
  divFeed.classList.add('d-flex', 'w-100', 'justify-content-between');

  const h = document.createElement('h5');
  h.classList.add('mb-1');
  h.textContent = title;

  const p = document.createElement('p');
  p.classList.add('mb-1');
  p.textContent = description;

  divFeed.append(h);
  feedsPart.append(divFeed);
  feedsPart.append(p);
};

const addArticlesPart = (data) => {
  const articlesPart = document.querySelector('div.articles-group');
  const items = data.querySelectorAll('item');

  items.forEach((item) => {
    const a = document.createElement('a');
    a.setAttribute('href', item.querySelector('link').innerHTML);
    a.classList.add('list-group-item', 'list-group-item-action');
    a.textContent = item.querySelector('title').textContent;
    articlesPart.append(a);
  });
};

export default (data) => {
  addFeedsPart(data);
  addArticlesPart(data);
};
