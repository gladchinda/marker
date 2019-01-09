const cheerio = require('cheerio');
const BLANK_OUTPUT = String();

/**
 * @function render
 * @description Overrides the default rendering for strong tokens.
 *
 * @returns {string} The rendered HTML.
 */
const render = (text) => {

	if (!(typeof text === 'string' && text.trim())) {
		return BLANK_OUTPUT;
	}

	const CLASS = 'strong';
	const EM_CLASS = 'em';
	const EM_STRONG = [EM_CLASS, CLASS].join('--');

	const $ = cheerio.load(`
		<strong class="${CLASS}">${text}</strong>
	`);

	const $strong = $('strong').first();

	$strong.find('em').each((i, elem) => {
		$strong.is(elem.parent) && $(elem).addClass(EM_STRONG);
	});

	$strong.find('*').each((i, elem) => {
		const $elem = $(elem);
		!(elem.name === 'code' || $elem.hasClass(EM_STRONG)) && $elem.replaceWith($elem.text());
	});

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');
};

module.exports = render;
