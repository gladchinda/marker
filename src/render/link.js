const cheerio = require('cheerio');
const { isURL } = require('validator');
const classnames = require('classnames');
const BLANK_OUTPUT = String();

/**
 * @function render
 * @description Overrides the default rendering for link tokens.
 *
 * @param {string} href The link href URL.
 * @param {string} title The link title text.
 * @param {string} text The link text.
 *
 * @returns {string} The rendered HTML.
 */
const render = (href, title, text = href) => {

	if (!(text && href && isURL(href))) {
		return BLANK_OUTPUT;
	}

	const __target__ = '_blank';
	const __rel__ = ['nofollow', 'noopener', 'noreferrer'].join(' ');

	const CLASS = 'link';

	const linkClass = classnames([
		CLASS, [ CLASS, 'a' ].join('--')
	]);

	const $ = cheerio.load(`
		<a href="${href}" target="${__target__}" class="${linkClass}" rel="${__rel__}">
			${text}
		</a>
	`);

	if (typeof title === 'string' && title.trim()) {
		$('a').first().attr('title', title.trim());
	}

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');
};

module.exports = render;
