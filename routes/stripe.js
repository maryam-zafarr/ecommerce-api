const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51LzQbRDbS1aURwwgJIxrJnTasoxjFyqDx5eLyWZvDVHjEPr7i2vjVbaVS8LZrE1cfG6869OmnHG38443PIQJtPZQ00Woc6rDLT"
);

router.post("/payment", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(Math.round(req.body.amount) * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });
  res.status(200).json(paymentIntent.client_secret);
});

module.exports = router;
