const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello From Server !!");
});

app.post('/generate-images', async (req, res) => {
    try {
        const { prompt, n } = req.body;
        // console.log("/////////////////" + JSON.stringify(req, null, 2));

        if (!prompt || !n || isNaN(n)) {
            return res.status(400).json({ error: 'Prompt and a valid number of images are required' });
        }

        const response = await axios.post(
            `${process.env.OPEN_AI_URL}`,
            {
                prompt: prompt,
                n: n,
                size: '512x512',
                response_format: 'b64_json',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        //console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


