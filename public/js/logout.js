/* eslint-disable */
const logOutBtn = document.querySelector('.nav__el--logout');

const logout = () => {
  try {
    fetch('http://localhost:3000/api/v1/users/logout', {
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
    console.log('Something went wrong: try again later');
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
