const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-messaging-sw.json");

if (!serviceAccount) {
    console.error("❌ Firebase service account JSON file is missing.");
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://web-notifications-b413b.firebaseio.com",
});

const db = admin.firestore();

// 🔹 Subscribe user tokens
app.post("/subscribe", async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        // Store the token in Firestore
        await db.collection("subscribers").doc(token).set({ token, createdAt: new Date() });
        res.json({ success: true, message: "Token saved" });
    } catch (error) {
        console.error("Error saving token:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Send Notifications
app.post("/sendNotification", async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

    try {
        const tokensSnapshot = await db.collection("subscribers").get();
        const tokens = tokensSnapshot.docs.map((doc) => doc.id);

        if (tokens.length === 0) return res.status(400).json({ error: "No subscribers found" });

        const payload = {
            notification: { title, body: message },
            webpush: {
                headers: {
                    Urgency: "high"
                },
                notification: {
                    icon: "/favicon.ico",
                    actions: [{ action: "open", title: "View" }]
                }
            }
        };

        await admin.messaging().sendToDevice(tokens, payload);
        res.json({ success: true, message: "Notification sent" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

