export default async function handler(req, res) {
    if (req.method === 'POST') {
      // For 'application/x-www-form-urlencoded', the body parser will automatically parse the data
      // and populate `req.body` with an object representing the form fields.
      
      console.log(req.body); // Log the parsed form data
  
      // Respond to the client
      res.status(200).json({ message: 'Data logged', formData: req.body });
    } else {
      // Handle any non-POST requests
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  