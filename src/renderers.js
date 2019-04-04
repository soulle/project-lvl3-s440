export const addArticlesPart = (articles) => {
  console.log('atticles___', articles);
  console.log('atticles___', articles.length);
  const articlesPart = document.querySelector('ul.articles-group');

  articles.forEach((item) => {
    const { articleLink, articleTitle } = item;

    const div = document.createElement('div');
    div.classList.add('container');

    const a = document.createElement('a');
    a.setAttribute('href', articleLink);
    a.textContent = articleTitle;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Description';

    articlesPart.append(div);
    div.append(a);
    div.append(button);
  });
};

export const addFeedsPart = (feeds) => {
  console.log('feeds', feeds);
  console.log('feeds', feeds.length);
  const [title, description] = feeds;
  const feedsPart = document.querySelector('div.feeds-group');
  const divFeed = document.createElement('div');
  divFeed.classList.add('container');
  // 'list-group-item'

  const h = document.createElement('h3');
  h.classList.add('mb-1');
  h.textContent = title;

  const p = document.createElement('p');
  p.classList.add('mb-1');
  p.textContent = description;

  divFeed.append(h);
  divFeed.append(p);
  feedsPart.append(divFeed);
};
