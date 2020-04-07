/* eslint-disable */
import { showAlert } from './flash';

export const updateData = async (data, type) => {
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
