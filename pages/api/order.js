import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  try {
    await mail.send({
      from: 'charlieram96@gmail.com',
      to: 'charlieramirez96@gmail.com',
      subject: 'Order created',
      html: `<div>${JSON.stringify(orderData)}</div>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent.' }),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email failed.' }),
    };
  }

}