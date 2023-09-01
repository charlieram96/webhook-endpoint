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
            <div style="position: relative; padding: 20px 50px 50px 50px; background-color: #95b6fc; border-radius: 0px; color: #fff; font-weight: 800;">
            <svg width="1385" height="545" viewBox="0 0 1385 545" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; opacity: .3; object-fit: cover; left: 50%; transform: translateX(-50%);">
              <path d="M0 0C315.5 224 1043 227.5 1385 0V417.5H0V0Z" fill="#D9E5FE"/>
              <path d="M0 115C315.5 339 1043 342.5 1385 115V545H0V115Z" fill="#8FB2FC"/>
              <path d="M0 230C315.5 454 1043 457.5 1385 230V545H0V230Z" fill="#0050F6"/>
              <path d="M0 345C315.5 569 1043 572.5 1385 345V545H0V345Z" fill="#142278"/>
            </svg>
            <div style="position: relative; z-index: 1;">
              <br><br>
              Dear ${recipient.firstName} ${recipient.lastName}, <br><br>
              ${donorFirstName} ${donorLastName} has made a generous gift in your name for our Annual Make-A-Wish Fundraiser! This contribution will go towards supporting the Make-A-Wish Foundation in their mission to grant the wishes of children with critical illnesses.
              <br><br>Warm regards,
              <br><br>
              Cerberus DEI Team
            </div>
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
