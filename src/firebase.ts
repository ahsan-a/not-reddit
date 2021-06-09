import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = JSON.parse(process.env.VUE_APP_firebaseSettings);

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
