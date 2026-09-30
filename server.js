require("dotenv").config();
const express = require ("express");
const axios = require("axios");
const app = express();

async function getAccessToken() {
    const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            auth: {
                username: process.env.CONSUMER_KEY,
                password: process.env.CONSUMER_SECRET
            }
        }
    );

    return response.data.access_token;
}

getAccessToken()
    .then(token => {
        console.log("Access Token:", token);
    })
    .catch(error => {
        console.log("Error:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Daraja Learning Server");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});