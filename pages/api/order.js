import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Parse the order data from the request body
    const orderData = req.body;

    const note = orderData.note;
    let formattedNote = note.replace(/\\n/g, '').replace(/\\"/g, '"');
    console.log(formattedNote); // This will output your JSON as a string without newline characters and with unescaped quotes.

    let firstName = formattedNote.first_name;
    let lastName = formattedNote.last_name;
    let department = formattedNote.department;
    let tickets = formattedNote.tickets;

    try {
      // Try to send the email
      await mail.send({
        from: 'charlieram96@gmail.com',
        to: 'charlieramirez96@gmail.com',
        subject: 'Order created',
        html: `
          <div>
            First name: ${firstName}
            Last name: ${lastName}
            Department: ${department}
            Tickets: ${tickets}
          </div>`,
      });

      // Respond with a success status and message
      res.status(200).json({ message: 'Email sent.' });
    } catch (error) {
      // Log the error and respond with an error status and message
      console.error(error);
      res.status(500).json({ message: `Email failed: ${error.message}` });
    }
  } else {
    // If the request method isn't POST, respond with a 405 'Method Not Allowed' status
    res.status(405).json({ error: 'Method not allowed' });
  }
}
