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

async function stkPush() {
    
    const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);

    const shortCode = "174379";
const passkey = "YOUR_PASSKEY";

const password = Buffer.from(
    shortCode + passkey + timestamp
).toString("base64");

const accessToken = await getAccessToken();

const stkPushData = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: 1,
    PartyA: "254722000000",
    PartyB: shortCode,
    PhoneNumber: "254722000000",
    CallBackURL: "https://example.com/callback",
    AccountReference: "CARWASH",
    TransactionDesc: "Car wash payment"
};

const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    stkPushData,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    }
);

console.log(response.data);
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