import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import parseData from './parser';
import { addArticlesPart, addFeedsPart } from './renderers';

const app = () => {
  const state = {
    form: {
      valid: true,
      submit: 'disabled',
      request: 'not sent',
    },
    spinner: 'off',
    currentURL: null,
    feedsURL: [],
    feeds: [],
    articles: [],
  };

  const input = document.getElementById('addAddress');
  const submit = document.querySelector('button');
  const spinner = document.querySelector('.spinner-border');

  const isValid = value => isURL(value) && !state.feedsURL.includes(value);

  input.addEventListener('input', () => {
    if (input.value.length === 0) {
      state.form.valid = true;
      state.form.submit = 'disabled';
    } else {
      state.form.valid = isValid(input.value);
      state.currentURL = input.value;
      state.form.submit = state.form.valid ? 'enabled' : 'disabled';
    }
  });

  const addData = () => {
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = new URL(`${cors}${state.currentURL}`);
    axios.get(url)
      .then((response) => {
        const { feedTitle, feedDescription, articles } = parseData(response.data);
        state.feeds = [feedTitle, feedDescription];
        state.articles = [...articles];
      });
  };

  submit.addEventListener('click', () => {
    state.spinner = 'on';
    state.feedsURL.push(state.currentURL);
    state.form.submit = 'disabled';
    state.form.request = 'sent';
    addData();
  });

  watch(state, 'spinner', () => {
    spinner.hidden = state.spinner === 'off';
  });

  watch(state.form, 'request', () => {
    if (state.form.request === 'sent') {
      input.value = '';
    }
  });

  watch(state, 'feeds', () => {
    addArticlesPart(state.articles);
    addFeedsPart(state.feeds);
  });

  watch(state, 'form', () => {
    submit.disabled = state.form.submit === 'disabled';
    if (state.form.valid === false) {
      input.style.border = 'thick solid red';
    } else {
      input.style.border = null;
    }
  });
};

export default app;
