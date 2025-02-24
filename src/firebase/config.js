
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAAceSsQR_fhtM4MgFzt5VdJdkeKiJ4HSY",
  authDomain: "random-afbaf.firebaseapp.com",
  projectId: "random-afbaf",
  storageBucket: "random-afbaf.firebasestorage.app",
  messagingSenderId: "495010483120",
  appId: "1:495010483120:web:c047f0837ece860075e475",
  measurementId: "G-L8D313BRRG"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };