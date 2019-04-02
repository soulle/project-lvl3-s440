import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';

const app = () => {
  const state = {
    form: {
      valid: 'neutral',
    },
  };
  const input = document.getElementById('addAddress');

  input.addEventListener('keyup', () => {
    if (input.value.length === 0) {
      state.form.valid = 'neutral';
    } else {
      state.form.valid = isURL(input.value);
    }
  });

  watch(state, 'form', () => {
    console.log('STATE', state.form.valid);
    if (state.form.valid === 'neutral') {
      console.log('null');
      input.style.border = null;
    } else {
      input.style.border = state.form.valid ? 'thick solid green' : 'thick solid red';
    }
  });
};

app();
