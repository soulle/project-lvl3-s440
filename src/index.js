import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';

const app = () => {
  const state = {
    form: {
      valid: true,
    },
  };
  const input = document.getElementById('addAddress');

  input.addEventListener('keyup', () => {
    if (input.value === '') {
      state.form.valid = true;
    }
    state.form.valid = isURL(input.value);
  });

  watch(state, 'form', () => {
    if (state.form.valid === false) {
      input.style.border = 'thick solid red';
    } else {
      input.style.border = null;
    }
  });
};

app();
