/* eslint-disable */
import { showAlert } from './flash';

export const signup = (name, email, password, passwordConfirm) => {
  fetch('/api/v1/users/signup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    // Credentials: 'include',
    body: JSON.stringify({
      name,
      email,
      password,
      passwordConfirm
    })
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        showAlert('success', 'Registered successfull, redirecting...');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
      if (res.status === 'error') {
        showAlert('error', res.message.split(':')[2]);
      }
      // console.log(res);
    });
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  signup(name, email, password, passwordConfirm);
});
