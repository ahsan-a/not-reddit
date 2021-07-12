import firebase from '../firebase';
import db from '@/db';
import { reactive } from 'vue';
import { CreatePost } from '@/typings';
import sanitizeHtml from 'sanitize-html';
// import store from '.';

const state = reactive({
	newPost: {
		subreddit: 'r/General',
		title: '',
		content: '',
	},
	fullscreen: false,
});

const actions = {
	async createPost(post: Partial<CreatePost>): Promise<void> {
		const result = db.collection('posts').doc();
		post.id = result.id;
		post.created_at = firebase.firestore.FieldValue.serverTimestamp();
		post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
		await db
			.collection('posts')
			.doc(post.id)
			.set(post);
	},

	purify: (text: string): string =>
		sanitizeHtml(text, {
			allowedTags: [
				'a',
				'abbr',
				'address',
				'article',
				'aside',
				'b',
				'bdi',
				'bdo',
				'blockquote',
				'br',
				'caption',
				'cite',
				'code',
				'col',
				'colgroup',
				'data',
				'dd',
				'details',
				'dfn',
				'div',
				'dl',
				'dt',
				'em',
				'figcaption',
				'figure',
				'footer',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'header',
				'hgroup',
				'hr',
				'i',
				'img',
				'kbd',
				'li',
				'main',
				'mark',
				'marquee',
				'nav',
				'ol',
				'p',
				'pre',
				'q',
				'rb',
				'rp',
				'rt',
				'rtc',
				'ruby',
				's',
				'samp',
				'section',
				'small',
				'span',
				'strong',
				'sub',
				'summary',
				'sup',
				'table',
				'tbody',
				'td',
				'tfoot',
				'th',
				'thead',
				'time',
				'tr',
				'u',
				'ul',
				'var',
				'video',
				'wbr',
			],
			disallowedTagsMode: 'discard',
			allowedAttributes: {
				a: ['href', 'name', 'target'],
				// We don't currently allow img itself by default, but this
				// would make sense if we did. You could add srcset here,
				// and if you do the URL is checked for safety
				img: ['src'],
				video: ['src', 'controls', 'poster'],
			},
			// Lots of these won't come up by default because we don't allow them
			selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
			// URL schemes we permit
			allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
			allowedSchemesByTag: {},
			allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
			allowProtocolRelative: true,
			enforceHtmlBoundary: false,
		}),
};

export default {
	state,
	actions,
};
