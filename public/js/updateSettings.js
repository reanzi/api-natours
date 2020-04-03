/* eslint-disable */
// import axios from 'axios';
// import { showMsg } from './flash.js';

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(() => {
    hideAlert();
  }, 5000);
};

// type is either 'password' or 'data'
// const updateSettings = async (data, type) => {
//   try {
//     const url =
//       type === 'password'
//         ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
//         : 'http://127.0.0.1:3000/api/v1/users/updateMe';

//     const res = await axios({
//       method: 'PATCH',
//       url,
//       data
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `${type.toUpperCase()} updated successfully!`);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

// const saveSetting = document.querySelector('.form');
// if (saveSetting) saveSetting.addEventListener('submit', updateSettings);

const updateData = (name, email) => {
  try {
    fetch('http://localhost:3000/api/v1/users/updateMe', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // Credentials: 'include',
      body: JSON.stringify({
        name,
        email
        // password
        // // passwordConfirm
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === 'success') {
          showAlert('success', ` updated successfully!`); //${type.toUpperCase()}
        }
        if (res.status === 'fail') {
          showAlert('error', `${res.message}`); //${type.toUpperCase()}
        }
      });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const saveSetting = document.querySelector('.form-user-data');
if (saveSetting) {
  saveSetting.addEventListener('submit', e => {
    e.preventDefault();
    // get the values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}
