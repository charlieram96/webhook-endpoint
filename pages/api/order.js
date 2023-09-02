import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Parse the order data from the request body
    const orderData = req.body;

    const note = orderData.note;

    let lines = note.trim().split(";");
    lines = lines.map(line => line.trim());

    let donorFirstName, donorLastName, firstName, lastName, department, whereToList;
    let recipientsArray = [];

    lines.forEach(line => {
        if (line.startsWith("Recipient: ")) {
            whereToList = "A Cerberus Employee";
            let recipientInfo = line.replace("Recipient: ", "").split(", ");
            let name = recipientInfo[0].split(" ");
            firstName = name[0];
            lastName = name[1];
            let tickets = parseInt(recipientInfo[1].replace("qty: ", ""), 10);
            let email = recipientInfo[2].replace("email: ", "");
            recipientsArray.push({firstName, lastName, tickets, email});
        } else if (line.startsWith("Department: ")) {
            whereToList = "For a Department";
            department = line.replace("Department: ", "");
        } else if (line.startsWith("Donor: ")) {
            let donorName = line.replace("Donor: ", "").split(" ");
            donorFirstName = donorName[0];
            donorLastName = donorName[1];
        }
    });

    console.log({firstName, lastName, department, whereToList, recipientsArray});

    try {
      // Try to send the email
      await Promise.all(recipientsArray.map(async (recipient) => {
        if (recipient.email) {
          await mail.send({
            from: 'no-reply.maw@cerberus.com',
            to: recipient.email,
            subject: 'Gift In Your Name',
            html: `
            <div style="position: relative; border-radius: 0px; background-color: #D9E5FE; color: #657aa5 !important; border: 3px solid #c5d6f8; font-weight: 800;">
            <div style="position: relative; z-index: 1; padding: 15px 50px 50px 50px;">
            <br><br>
            Dear ${recipient.firstName} ${recipient.lastName}, <br><br>
            ${donorFirstName} ${donorLastName} has made a generous gift in your name for our Annual Make-A-Wish Fundraiser! This contribution will go towards supporting the Make-A-Wish Foundation in their mission to grant the wishes of children with critical illnesses.
            <br><br>Warm regards,
            <br><br>
            Cerberus DEI Team
            </div>
            <img src="https://maw.cerberus.com/images/curves-low-opacity.png" alt="curves" style="display: block; position: absolute !important; width: 100% !important; bottom: 0 !important; left: 0 !important; object-fit: contain !important;" width="709" height="279" />
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
