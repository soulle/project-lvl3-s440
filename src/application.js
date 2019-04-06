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
    feeds: [],
    articles: [],
    modal: {
      status: 'inactive',
      data: {},
    },
  };

  const input = document.getElementById('addAddress');
  const submit = document.querySelector('button');
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

  watch(state, 'formStatus', () => {
    console.log('state.formStatus', state.formStatus);
    formStatuses[state.formStatus]();
  });

  input.addEventListener('input', () => {
    if (input.value === '') {
      state.formStatus = 'empty';
    } else {
      state.formStatus = isValid(input.value) ? 'valid' : 'invalid';
      state.currentURL = input.value;
    }
  });

  submit.addEventListener('click', () => {
    state.feedsURL.push(state.currentURL);
    state.formStatus = 'loading';

    const url = new URL(`${cors}${state.currentURL}`);
    axios.get(url)
      .then((response) => {
        const { feedTitle, feedDescription, articles } = parseData(response.data);

        state.feeds = [feedTitle, feedDescription];
        state.articles = articles;
        state.formStatus = 'empty';
      })
      .catch((error) => {
        state.formStatus = 'error';
        feedback.textContent = error;
      });
  });

  watch(state, 'feeds', () => {
    renderArticles(state.articles);
    renderFeeds(state.feeds);
    const buttons = document.querySelectorAll('button[data-target="#exampleModal"]');
    buttons.forEach(button => button.addEventListener('click', (e) => {
      const current = e.target;
      console.log('current', current);

      const title = current.previousElementSibling.textContent;
      console.log('title', title);

      const description = current.getAttribute('data-description');
      console.log('description', description);

      state.modal.data = { title, description };
      state.modal.status = 'active';
      console.log('state.modal.status', state.modal);
    }));
  });

  watch(state, 'modal', () => {
    if (state.modal.status === 'active') {
      console.log('STATE AFTER', state);
      const { title, description } = state.modal.data;
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-body').textContent = description;
      // modal.find('.modal-body').html(description);
    }
  });

  $('#exampleModal').on('hide.bs.modal', () => {
    state.modal.status = 'inactive';
    state.modal.data = {};
  });
};

export default app;
