export const renderArticles = (articles) => {
  const articlesPart = document.querySelector('ul.articles-group');
  articlesPart.innerHTML = '';

  articles.forEach((item) => {
    const { articleLink, articleTitle, articleDescription } = item;

    const div = document.createElement('div');
    div.classList.add('container');

    const a = document.createElement('a');
    a.setAttribute('href', articleLink);
    a.textContent = articleTitle;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.setAttribute('data-description', articleDescription);
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Description';

    articlesPart.append(div);
    div.append(a);
    div.append(button);
  });
};

export const renderFeeds = (feeds) => {
  const feedsPart = document.querySelector('div.feeds-group');
  feedsPart.innerHTML = '';

  feeds.map(({ feedTitle, feedDescription }) => {
    const divFeed = document.createElement('div');
    divFeed.classList.add('container');

    const h = document.createElement('h3');
    h.classList.add('mb-1');
    h.textContent = feedTitle;

    const p = document.createElement('p');
    p.classList.add('mb-1');
    p.textContent = feedDescription;

    divFeed.append(h);
    divFeed.append(p);
    feedsPart.append(divFeed);
    return null;
  });
};
