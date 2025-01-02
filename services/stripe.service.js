const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency) => {
  // Logic to create a payment intent
};

module.exports = { createPaymentIntent };
