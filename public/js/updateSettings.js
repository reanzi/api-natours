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

const updateData = async (data, type) => {
  try {
    // console.log(data);
    let response;
    if (type === 'data') {
      response = await fetch('/api/v1/users/updateMe', {
        method: 'PATCH',
        body: new FormData(data)
      });
    }
    if (type === 'password') {
      response = await fetch('/api/v1/users/password_update', {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        Credentials: 'include',
        body: JSON.stringify(data)
      });
    }

    let res = await response.json();
    // console.log(res);
    if (res.status === 'success') {
      showAlert('success', ` ${type.toUpperCase()} updated successfully!`);
    }
    if (res.status === 'error') {
      showAlert('error', `${res.message}`);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

const formData = document.getElementById('formData');
if (formData) {
  formData.onsubmit = async e => {
    e.preventDefault();
    await updateData(formData, 'data');
  };
}
const formPassword = document.querySelector('.form-user-settings');
if (formPassword) {
  formPassword.onsubmit = async e => {
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
  };
}

// const imgInput = document.querySelector('.form__upload');
// const usePhoto = document.querySelector('.form__user-photo');
// function readURL(imgInput) {
//   // var url = imgInput.value;
//   // var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
//   if (imgInput.files) {
//     var reader = new FileReader();

//     reader.onload = function(e) {
//       console.log(e);
//       usePhoto.attr('src', e.target.result);
//     };

//     reader.readAsDataURL(imgInput.files[0]);
//   }
//   //  else {
//   //   usePhoto.attr('src', `img/users/${user.photo}`);
//   // }
// }

// document.querySelector('.form__upload').addEventListener('click', () => {
//   readURL(this);
// });
