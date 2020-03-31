/* eslint-disable */

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
  }).then(res => {
    console.log(res);
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
