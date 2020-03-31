/* eslint-disable */

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
    }).then(res => {
      if (res.status === 200) {
        alert('oooophs');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
      console.log(res);
    });

    // console.log(result);
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const res = await axios({
  //     method: 'POST',
  //     url: 'http://127.0.0.1:3000/api/v1/users/login',
  //     data: {
  //       email,
  //       password
  //     }
  //   });
  //   if (res.data.status === 'success') {
  //     alert('oooophs');
  //     window.setTimeout(() => {
  //       location.assign('/');
  //     }, 1500);
  //   }
  //   // console.log(res);
  // } catch (error) {
  //   alert(error.response.data.message);
  // }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
