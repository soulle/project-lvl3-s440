import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
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
    modal: 'closed',
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

  const makeInitial = () => {
    state.form.request = 'not sent';
    state.spinner = 'off';
    state.currentURL = null;
  };

  watch(state, 'feeds', () => {
    addArticlesPart(state.articles);
    addFeedsPart(state.feeds);
    makeInitial();
  });

  watch(state, 'form', () => {
    submit.disabled = state.form.submit === 'disabled';
    if (state.form.valid === false) {
      input.style.border = 'thick solid red';
    } else {
      input.style.border = null;
    }
  });

  $('#exampleModal').on('show.bs.modal', function f(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const recipient = button.data('description'); // Extract info from data-* attributes
    console.log('recipient', recipient);
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    const modal = $(this);
    modal.find('.modal-title').text('Description');
    modal.find('.modal-body').html(`${recipient}`);
  });
};

export default app;
