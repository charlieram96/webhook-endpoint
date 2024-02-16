export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Collect incoming data as a string
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
  
      req.on('end', () => {
        console.log(data); // Log the raw XML data
  
        // Now, you can proceed with converting this XML to JSON,
        // or simply return a response indicating the data was received.
        res.status(200).json({ message: 'Data logged', rawData: data });
      });
  
      // If there's an error, we'll catch it here
      req.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Error during data reception' });
      });
    } else {
      // Handle any non-POST requests
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  