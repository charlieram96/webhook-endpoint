import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Log the data being forwarded to ensure it's not undefined
    console.log('Forwarding data:', JSON.stringify(req.body));

    try {
      const response = await axios.post('https://dev-marko.aramark.net/v1/forms/capture', req.body, {
        headers: {
          'apikey': '4AzMhe9mqSSzrTM0IR9ORSBqrGTcV6Al',
          'Content-Type': 'application/json'
        }
      });

      console.log('Forwarded data response:', response.data);
      res.status(200).json({ message: 'Data forwarded successfully', forwardedResponse: response.data });
    } catch (error) {
      console.error('Error forwarding data:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to forward data', details: error.response ? error.response.data : error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
