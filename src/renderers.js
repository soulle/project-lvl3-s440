export const addArticlesPart = (articles) => {
  console.log('atticles part', articles);
  console.log('atticles part', articles.length);
  const articlesPart = document.querySelector('ul.articles-group');

  articles.forEach((item) => {
    // console.log('item', item);

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
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Description';

    button.addEventListener('click', (e) => {
      document.getElementById('exampleModalLabel').textContent = articleTitle;
      document.querySelector('.modal-body').textContent = articleDescription;
      console.log('current button', e.target);
      console.log('closest div', e.target.closest('div'));
    });

    articlesPart.append(div);
    div.append(a);
    div.append(button);
  });
};

export const addFeedsPart = (feeds) => {
  console.log('feeds part', feeds);
  console.log('feeds part', feeds.length);
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
