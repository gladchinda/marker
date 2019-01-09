const cheerio = require('cheerio');
const classnames = require('classnames');
const BLANK_OUTPUT = String();

/**
 * @function render
 * @description Overrides the default rendering for heading tokens.
 *
 * @param {string} text The heading text.
 * @param {number} level The heading level (from 1 - 6).
 * @param {string} raw The raw heading text.
 *
 * @returns {string} The rendered HTML.
 */
const render = (text, level, raw) => {

	if (!(typeof raw === 'string' && raw.trim())) {
		return BLANK_OUTPUT;
	}

	const tag = `h${level}`;
	const CLASS = 'heading';

	const textClass = classnames([
		[CLASS, 'text'].join('__')
	]);

	const headingClass = classnames([
		CLASS,
		[CLASS, tag].join('--')
	]);

	const $ = cheerio.load(`
		<${tag} class="${headingClass}">
			<span class="${textClass}">${raw}</span>
		</${tag}>
	`);

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');

};

module.exports = render;
