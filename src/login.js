/* eslint-disable */

import { showAlert } from './flash';

export const login = async (email, password) => {
  // console.log(email, password);
  try {
    const result = fetch('/api/v1/users/login', {
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
    showAlert('error', res.message);
  }
};

export const logout = () => {
  try {
    fetch('/api/v1/users/logout', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
      // Credentials: 'include',
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          location.assign('/');
          //   location.reload(true);
        }
      });
  } catch (error) {
    // console.log('Something went wrong: try again later');
  }
};
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
