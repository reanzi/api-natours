/* eslint-disable */
const stripe = Stripe('pk_test_jkwsrC21seIxiWq7a8LA4Ubr00omKJgDQ0');
export const bookTour = async tourID => {
  try {
    const session = await fetch(`/api/v1/bookings/checkout-session/${tourID}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const res = await session.json();
    // 2. Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: res.session.id
    });
  } catch (error) {
    // console.log(error);
  }
};
