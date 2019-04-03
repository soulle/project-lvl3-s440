import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import addData from './renderers';

const app = () => {
  const state = {
    form: {
      valid: 'neutral',
      submitDisabled: true,
      submitted: false,
    },
    current: null,
  };

  let feeds = [];
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const input = document.getElementById('addAddress');
  const submit = document.querySelector('button');
  const spinner = document.querySelector('.spinner-border');

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

  const getData = () => {
    const url = new URL(`${cors}${state.current}`);
    const parser = new DOMParser();
    axios.get(url)
      .then((response) => {
        const parsedData = parser.parseFromString(response.data, 'application/xml');
        return parsedData;
      })
      .then(addData)
      .then(() => {
        spinner.hidden = true;
      });
  };

  submit.addEventListener('click', () => {
    spinner.hidden = false;
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
      feeds = [...feeds, state.current];
      getData();
    }
  });
};

export default app;
