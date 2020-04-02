/* eslint-disable */
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const signup = (name, email, password, passwordConfirm) => {
  fetch('http://localhost:3000/api/v1/users/signup', {
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
