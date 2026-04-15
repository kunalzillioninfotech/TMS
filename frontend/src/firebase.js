import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCg0zFUeBXnoYXXtJPyFBgCl-xLdwi3Nko",
    authDomain: "task-management-system-9bab7.firebaseapp.com",
    projectId: "task-management-system-9bab7",
    storageBucket: "task-management-system-9bab7.firebasestorage.app",
    messagingSenderId: "692816566369",
    appId: "1:692816566369:web:6fb00e17b14d970ff47220",
    measurementId: "G-J1T2412NN4"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);