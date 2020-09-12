/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js')

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
*/
firebase.initializeApp({
    apiKey: "AIzaSyAmaQpj-HpYZHOLL08737doT4QM1xIcnkw",
    authDomain: "mr-data-fcm.firebaseapp.com",
    databaseURL: "https://mr-data-fcm.firebaseio.com",
    projectId: "mr-data-fcm",
    storageBucket: "mr-data-fcm.appspot.com",
    messagingSenderId: "351645999964",
    appId: "1:351645999964:web:1748b1dbb38c49c31c1799",
    measurementId: "G-KH2FXB7E6M"
})

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notification = JSON.parse(payload.data.notification);
    // Customize notification here
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body,
        icon: notification.icon
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});