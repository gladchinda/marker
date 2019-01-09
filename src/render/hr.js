const cheerio = require('cheerio');
const classnames = require('classnames');

/**
 * @function render
 * @description Overrides the default rendering for hr tokens.
 *
 * @returns {string} The rendered HTML.
 */
const render = () => {
	const CLASS = 'line';
	const LINE = [CLASS, 'hr'];

	const dividerClass = classnames([
		CLASS, LINE.join('--')
	]);

	const hrClass = LINE.join('__');

	const $ = cheerio.load(`
		<div class="${dividerClass}">
			<hr class="${hrClass}">
		</div>
	`);

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');
};

module.exports = render;
