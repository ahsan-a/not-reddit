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

interface subreddit {
	approved: boolean;
	created_at: firebase.firestore.FieldValue;
	description: string;
	id: string;
	name: string;
	user_id: string;
}
