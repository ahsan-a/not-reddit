import firebase from '@/firebase';

export interface User {
	admin: boolean;
	createdAt: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	id: string;
	image: string;
	lastLoggedIn?: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	name: string;
}

export interface Subreddit {
	approved: boolean;
	created_at: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	description: string;
	id: string;
	name: string;
	user_id: string;
}

export interface Post {
	content: string;
	created_at: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	id: string;
	subreddit_id: string;
	title: string;
	updated_at: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	user_id: string;
	user?: Partial<User>;
}
