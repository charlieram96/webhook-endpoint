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
    
    let noteObj = JSON.parse(formattedNote);

    let firstName = noteObj.first_name;
    let lastName = noteObj.last_name;
    let department = noteObj.department;
    let tickets = noteObj.tickets;
    let whereToList = noteObj.where_to_list;
    let recipientsArray = whereToList == "A Cerberus Employee" ? noteObj.recipients : [];

    try {
      // Try to send the email
      await Promise.all(recipientsArray.map(async (recipient) => {
        if (recipient.recipient_email) { // Only send email if recipient_email is not empty
          await mail.send({
            from: 'charlieram96@gmail.com',
            to: recipient.recipient_email,
            subject: 'Gift In Your Name',
            html: `
              <div>
              Dear ${recipient.recipient_name} <br><br>
              ${firstName} ${lastName} has made a generous gift in your name for our Annual Make-A-Wish Fundraiser! This contribution will go towards supporting the Make-A-Wish Foundation in their mission to grant the wishes of children with critical illnesses. 
              <br>Warm regards, 
              <br><br>
              Cerberus DEI Team 
              </div>`,
          });
        }
      }));

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
