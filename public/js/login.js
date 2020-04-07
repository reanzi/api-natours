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

const login = async (email, password) => {
  // console.log(email, password);
  try {
    const result = fetch('http://localhost:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // Credentials: 'include',
      body: JSON.stringify({
        // name,
        email,
        password
        // passwordConfirm
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          showAlert('success', 'Logged in successfull, redirecting...');
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
        if (res.status === 'fail') {
          showAlert('error', res.message);
        }
        // console.log(res);
      });

    // console.log(result);
  } catch (err) {
    console.log(err);
    showAlert('error', res.message);
  }
};

document.querySelector('.form--login').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
