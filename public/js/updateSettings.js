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

const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/password_update'
        : 'http://localhost:3000/api/v1/users/updateMe';
    await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // Credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        if (res.status === 'success') {
          showAlert('success', ` ${type.toUpperCase()} updated successfully!`);
        }
        if (res.status === 'fail') {
          showAlert('error', `${res.message}`);
        }
      });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};

const userDataSetting = document.querySelector('.form-user-data');
if (userDataSetting) {
  userDataSetting.addEventListener('submit', e => {
    e.preventDefault();
    // get the values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData({ name, email }, 'data');
  });
}
const userPasswordSettings = document.querySelector('.form-user-settings');
if (userPasswordSettings) {
  userPasswordSettings.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent =
      'Save passwords';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
