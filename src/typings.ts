import firebase from '@/firebase';

export interface User {
	admin: boolean;
	createdAt: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	id: string;
	image: string;
	lastLoggedIn?: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
	name: string;
	about?: string;
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
	user?: User;
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

export interface Comment {
	content: string;
	id: string;
	parent_id: string | null;
	post_id: string;
	subreddit_id: string;
	user_id: string;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
	deleted?: boolean | undefined;
	user?: User;
	comments?: Comment[];
	post?: Post;
	subreddit?: Subreddit;
	deletedUser?: true;
	deletedPost?: true;
}

export interface Notification {
	title: string;
	body?: string;
	type: 'interaction' | 'error' | 'popup';
	id: string;
	sent_by?: string;
	unread: boolean;
	content_id?: string;
	content_type?: 'post' | 'comment';
	created_at: number;
	url?: string;
	sender?: User;
	deletedSender?: true;
}
