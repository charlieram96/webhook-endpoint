// Import Axios
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Assuming `req.body` contains the form data as JSON

    try {
      // Forward the form data to the specified endpoint
      const response = await axios.post('https://dev-marko.aramark.net/v1/forms/capture', req.body.formData, {
        headers: {
          'apikey': '4AzMhe9mqSSzrTM0IR9ORSBqrGTcV6Al',
          'Content-Type': 'application/json'
        }
      });

      // Handle response from the forwarded request
      console.log('Forwarded data response:', response.data);
      res.status(200).json({ message: 'Data forwarded successfully', forwardedResponse: response.data });
    } catch (error) {
      console.error('Error forwarding data:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to forward data', details: error.response ? error.response.data : error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
