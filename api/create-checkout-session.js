// api/create-checkout-session.js (Node / Vercel / Netlify style)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { line_items, success_url, cancel_url } = req.body;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || 'https://your-site.example/success.html',
      cancel_url: cancel_url || 'https://your-site.example/cancel.html'
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
