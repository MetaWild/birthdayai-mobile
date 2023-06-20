import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9FGCPNxubKtp-PRgRBbMPeyNIHt4tIMw",
  authDomain: "birthdayai-ae57c.firebaseapp.com",
  databaseURL: "https://birthdayai-ae57c-default-rtdb.firebaseio.com",
  projectId: "birthdayai-ae57c",
  storageBucket: "birthdayai-ae57c.appspot.com",
  messagingSenderId: "450039378725",
  appId: "1:450039378725:web:d2167fb175b4871c5b20cc",
  measurementId: "G-1VZQD72E32",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
