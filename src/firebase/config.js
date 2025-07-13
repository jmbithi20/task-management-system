import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDcHA8VctuGD8GTeKaOE7n6FJrUSpHYkVY",
    authDomain: "task-management-system-d005e.firebaseapp.com",
    projectId: "task-management-system-d005e",
    storageBucket: "task-management-system-d005e.appspot.com",
    messagingSenderId: "317272718514",
    appId: "1:317272718514:web:caea26f795f698497f9dab",
    measurementId: "G-6T557YSLG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 