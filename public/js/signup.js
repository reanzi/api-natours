/* eslint-disable */

const signup = (email, password) => {
  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/signup',
    data: {
      name,
      email,
      password,
      passwordConfirm
    }
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
