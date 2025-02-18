if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
} else {
    console.warn('Service Worker is not supported in this browser.');
}
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin SDK
const serviceAccount = require("./firebase-messaging-sw.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://web-notifications-b413b.firebaseio.com",
});

const db = admin.firestore();

// Subscribe user tokens
app.post("/subscribe", async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });
    try {
        await db.collection("subscribers").doc(token).set({ token });
        res.json({ success: true, message: "Token saved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send notifications
app.post("/sendNotification", async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

    try {
        const tokensSnapshot = await db.collection("subscribers").get();
        const tokens = tokensSnapshot.docs.map((doc) => doc.id);

        if (tokens.length === 0) return res.status(400).json({ error: "No subscribers found" });

        const payload = {
            notification: { title, body: message },
        };

        await admin.messaging().sendToDevice(tokens, payload);
        res.json({ success: true, message: "Notification sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));