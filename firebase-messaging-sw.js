importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

// ✅ Initialize Firebase inside Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyBmPvahKtWw5YguXo8zXLGjUp2khqcna0c",
    authDomain: "web-notifications-b413b.firebaseapp.com",
    projectId: "web-notifications-b413b",
    storageBucket: "web-notifications-b413b.appspot.com",
    messagingSenderId: "894487595254",
    appId: "1:894487595254:web:ee064c21e8fd5fba8144d7",
    measurementId: "G-Z5ED2LTGT8"
});

const messaging = firebase.messaging();

// ✅ Background Message Handling
messaging.onBackgroundMessage(payload => {
    console.log("📩 Background Message received:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/firebase-logo.png"
    });
});
