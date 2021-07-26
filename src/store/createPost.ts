import firebase from '../firebase';
import { reactive } from 'vue';
import sanitizeHtml from 'sanitize-html';

import markdown from 'markdown-it';

const md = new markdown({
	breaks: true,
	html: true,
	linkify: true,
	typographer: false,
	xhtmlOut: true,
})
	.use(require('markdown-it-abbr'))
	.use(require('markdown-it-footnote'))
	.use(require('markdown-it-highlightjs'))
	.use(require('markdown-it-sub'))
	.use(require('markdown-it-sup'))
	.use(require('markdown-it-task-lists'), { enabled: true })
	.use(require('markdown-it-toc'));

const state = reactive({
	newPost: {
		subreddit: 'r/General',
		title: '',
		content: '',
	},
	fullscreen: false,
});
interface CreatePost {
	title: string;
	content: string;
	subreddit_id: string;
	user_id: string;
	id_token?: string;
}

const actions = {
	async createPost(post: Partial<CreatePost>): Promise<boolean> {
		post.id_token = (await firebase.auth().currentUser?.getIdToken()) || '';

		const data = await fetch(`${process.env.VUE_APP_backend}post/createPost`, {
			method: 'POST',
			body: JSON.stringify(post),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((e) => alert(e));

		if (!data.success) alert(`Server Error: ${data.error}`);
		return Boolean(data.success);
	},

	purify: (text: string): string =>
		sanitizeHtml(md.render(text), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(['details', 'img', 'marquee', 'summary', 'video', 'input', 'iframe']),
			disallowedTagsMode: 'discard',
			allowedAttributes: {
				'*': ['align', 'style'],
				a: ['href', 'name', 'target'],
				img: ['src', 'srcset'],
				video: ['src', 'controls', 'poster'],
				iframe: ['src', 'title', 'frameborder', 'allowfullscreen', 'width', 'height'],
			},
			allowedClasses: {
				code: ['hljs', 'language-*'],
				span: ['hljs-*'],
				input: ['task-list-item-checkbox'],
			},
			// Lots of these won't come up by default because we don't allow them
			selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
			// URL schemes we permit
			allowedSchemes: ['http', 'https', 'mailto', 'tel'],
			allowedSchemesByTag: {},
			allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
			allowProtocolRelative: true,
			enforceHtmlBoundary: false,
			allowedIframeHostnames: ['www.youtube.com'],
		}),
};

export default {
	state,
	actions,
};
