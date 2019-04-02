import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';

const app = () => {
  const state = {
    form: {
      valid: 'neutral',
      submitDisabled: true,
      submitted: false,
    },
    current: null,
    spinner: 'off',
  };

  let feeds = [];
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const input = document.getElementById('addAddress');
  const submit = document.querySelector('button');

  input.addEventListener('input', (e) => {
    if (input.value.length === 0) {
      state.form.valid = 'neutral';
      state.form.submitDisabled = true;
    } else {
      state.form.valid = isURL(input.value) && !feeds.includes(input.value);
      state.current = state.form.valid ? e.target.value : null;
      state.form.submitDisabled = !state.form.valid;
    }
  });

  const addData = (data) => {
    const feedsPart = document.querySelector('div.feeds-group');
    const articlesPart = document.querySelector('div.articles-group');

    const title = data.querySelector('title').textContent;
    const description = data.querySelector('description').textContent;
    const items = data.querySelectorAll('item');

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
    console.log('items', items);
    items.forEach((item) => {
      const a = document.createElement('a');
      console.log('item', item.querySelector('link').innerHTML);
      a.setAttribute('href', item.querySelector('link').innerHTML);
      a.classList.add('list-group-item', 'list-group-item-action');
      a.textContent = item.querySelector('title').textContent;
      articlesPart.append(a);
    });
    state.spinner = 'off';
  };

  const getData = () => {
    feeds = [...feeds, state.current];
    const url = new URL(`${cors}${state.current}`);
    const parser = new DOMParser();
    axios.get(url)
      .then((response) => {
        const parsedData = parser.parseFromString(response.data, 'application/xml');
        addData(parsedData);
      });
  };

  submit.addEventListener('click', () => {
    // console.log('!!!', e.target);
    state.spinner = 'on';
    state.form.submitted = true;
  });

  watch(state, 'form', () => {
    submit.disabled = state.form.submitDisabled;
    if (state.form.valid === false) {
      input.style.border = 'thick solid red';
    } else {
      input.style.border = null;
    }
  });

  watch(state.form, 'submitted', () => {
    if (state.form.submitted === true) {
      input.value = '';
      getData();
    }
  });

  watch(state, 'spinner', () => {
    const spinner = document.querySelector('.spinner-border');
    spinner.hidden = state.spinner === 'off';
  });
};

app();
