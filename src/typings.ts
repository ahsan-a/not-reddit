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
	image?: string;
	name_lowercase?: string;
}

export interface Post {
	content: string;
	created_at: firebase.firestore.Timestamp;
	id: string;
	subreddit_id: string;
	title: string;
	updated_at: firebase.firestore.Timestamp;
	user_id: string;
	deletedUser?: boolean;
	user?: User;
	comments: Comment[];
}

export interface CreatePost {
	title: string;
	content: string;
	subreddit_id: string;
	user_id: string;
	id: string;
	created_at: firebase.firestore.FieldValue;
	updated_at: firebase.firestore.FieldValue;
}

export interface Comment {
	content: string;
	id: string;
	parent_id: string | null;
	post_id: string;
	subreddit_id: string;
	user_id: string;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
	user?: User;
	deletedUser?: true;
	comments?: Comment[];
}

export interface CreateComment {
	content: string;
	id?: string;
	parent_id: string | null;
	post_id: string;
	subreddit_id: string;
	user_id: string;
	created_at?: firebase.firestore.FieldValue;
	updated_at?: firebase.firestore.FieldValue;
}
