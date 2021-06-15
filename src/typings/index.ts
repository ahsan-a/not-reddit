import firebase from '@/firebase';

export interface User {
	admin?: boolean;
	createdAt?: firebase.firestore.Timestamp;
	id?: string;
	image?: string;
	lastLoggedIn?: firebase.firestore.Timestamp;
	name?: string;
	verified?: boolean;
	email?: string;
}
