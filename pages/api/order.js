export default async function handler(req, res) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method === 'POST') {
    const orderData = req.body;

    const msg = {
      to: "charlieramirez96@gmail.com", // Change to your recipient
      from: 'charlieram96@gmail.com', // Change to your verified sender
      subject: 'Order Confirmation',
      text: orderData,
      html: '<strong>Thank you for your order...</strong>',
    };
  
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
    // Here's where you'd process the order data, e.g. send an email to the customer
    // This is just a placeholder - you'd want to replace this with your actual email-sending code
    console.log('New order received:', orderData);

    // Send a 200 status back to Shopify to acknowledge receipt of the webhook
    res.status(200).json({ status: 'Received' });
  } else {
    const orderData = req.body;
    // If the request method isn't POST, return a 405 'Method Not Allowed' status
    const msg = {
      to: "charlieramirez96@gmail.com", // Change to your recipient
      from: 'charlieram96@gmail.com', // Change to your verified sender
      subject: 'Order Confirmation fail',
      text: orderData,
      html: '<strong>Thank you for your order...</strong>',
    };
  
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(405).json({ error: 'Method not allowed' });
  }


}