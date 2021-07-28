import firebase from './firebase';
const firestore = firebase.firestore();
const rtdb = firebase.database();

export { firestore, rtdb, firebase };
