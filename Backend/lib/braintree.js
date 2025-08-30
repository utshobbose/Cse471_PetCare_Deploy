const braintree = require("braintree");

const env = process.env.BRAINTREE_ENV === "production"
  ? braintree.Environment.Production
  : braintree.Environment.Sandbox;

const gateway = new braintree.BraintreeGateway({
  environment: env,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

module.exports = gateway;
