const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { line_items, success_url, cancel_url } = req.body;

    if(!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ error: 'line_items required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || (process.env.SITE_URL + '/success.html'),
      cancel_url: cancel_url || (process.env.SITE_URL + '/cancel.html')
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
