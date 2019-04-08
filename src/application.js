import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
import parseData from './parser';
import { renderArticles, renderFeeds } from './renderers';

const app = () => {
  const state = {
    formStatus: 'empty',
    currentURL: null,
    feedsURL: [],
    feedTitles: [],
    articles: [],
    modal: {
      status: 'inactive',
      description: '',
    },
  };

  const input = document.getElementById('addAddress');
  const submit = document.getElementById('submitButton');
  const inputForm = document.getElementById('inputForm');

  const spinner = document.querySelector('.spinner-border');
  const feedback = document.querySelector('.invalid-feedback');
  const modal = document.getElementById('exampleModal');
  const isValid = value => isURL(value) && !state.feedsURL.includes(value);
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const formStatuses = {
    empty: () => {
      input.value = '';
      submit.disabled = true;
      spinner.hidden = true;
      input.classList.remove('is-valid', 'is-invalid');
    },
    valid: () => {
      submit.disabled = false;
      spinner.hidden = true;
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    },
    invalid: () => {
      submit.disabled = true;
      spinner.hidden = true;
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.textContent = 'Input is invalid';
    },
    error: () => {
      submit.disabled = true;
      spinner.hidden = true;
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    },
    loading: () => {
      submit.disabled = true;
      spinner.hidden = false;
    },
  };
  console.log('state', state);

  watch(state, 'formStatus', () => formStatuses[state.formStatus]());

  input.addEventListener('input', () => {
    if (input.value === '') {
      state.formStatus = 'empty';
    } else {
      state.formStatus = isValid(input.value) ? 'valid' : 'invalid';
      state.currentURL = input.value;
    }
  });

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    state.formStatus = 'loading';

    const url = new URL(`${cors}${state.currentURL}`);
    axios.get(url)
      .then((response) => {
        const { feedTitle, feedDescription, articles } = parseData(response.data);

        state.feedTitles.push({ feedTitle, feedDescription });
        state.articles.push(...articles);

        state.formStatus = 'empty';
        state.feedsURL.push(state.currentURL);
      })
      .catch((error) => {
        state.formStatus = 'error';
        feedback.textContent = error;
      });
  });

  const update = () => {
    const promises = state.feedsURL.map(url => axios.get(new URL(`${cors}${url}`)));
    const promise = Promise.all(promises);

    return promise.then((responses) => {
      const receivedArticles = responses.map((response) => {
        const { articles } = parseData(response.data);
        return articles;
      }).flat();

      const currentLinks = state.articles.map(({ articleLink }) => articleLink);

      const newArticles = receivedArticles
        .filter((article) => {
          const { articleLink } = article;
          return !currentLinks.includes(articleLink);
        });

      state.articles.unshift(...newArticles);
    }).finally(setTimeout(update, 5000));
  };

  setTimeout(update, 5000);

  watch(state, 'articles', () => renderArticles(state.articles));

  watch(state, 'feedTitles', () => {
    renderArticles(state.articles);
    renderFeeds(state.feedTitles);
  });

  watch(state, 'modal', () => {
    if (state.modal.status === 'inactive') {
      return;
    }
    modal.querySelector('.modal-body').textContent = state.modal.description;
  });

  $('#exampleModal').on('show.bs.modal', (event) => {
    const current = $(event.relatedTarget);

    state.modal.description = current.data('description');
    state.modal.status = 'active';
  });

  $('#exampleModal').on('hide.bs.modal', () => {
    state.modal.status = 'inactive';
    state.modal.data = {};
  });
};

export default app;
