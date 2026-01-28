const express = require('express');
const sendEmail = require('./utils/sendEmail');
const app = express();

const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

app.use(express.json());

app.post('/send', async (req, res) => {

    const authHeader = req.headers['x-internal-secret'];
    
    if (authHeader !== INTERNAL_KEY) {
        console.log("Unauthorized access attempt blocked.");
        return res.status(403).json({ error: "Forbidden: Invalid Internal Key" });
    }
    
    const { to, subject, text, extraHtml } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: "Missing required fields (to, subject, text)" });
    }

    console.log(`Received request to email: ${to}`);

    const success = await sendEmail(to, subject, text, extraHtml);

    if (success) {
        return res.status(200).json({ message: "Email sent successfully" });
    } else {
        return res.status(500).json({ error: "Failed to send email" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Email Microservice running on port ${PORT}`));