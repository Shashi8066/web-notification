
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBmPvahKtWw5YguXo8zXLGjUp2khqcna0c",
    authDomain: "web-notifications-b413b.firebaseapp.com",
    projectId: "web-notifications-b413b",
    storageBucket: "web-notifications-b413b.firebasestorage.app",
    messagingSenderId: "894487595254",
    appId: "1:894487595254:web:ee064c21e8fd5fba8144d7",
    measurementId: "G-Z5ED2LTGT8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    });
});