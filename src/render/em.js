const cheerio = require('cheerio');
const BLANK_OUTPUT = String();

/**
 * @function render
 * @description Overrides the default rendering for em tokens.
 *
 * @returns {string} The rendered HTML.
 */
const render = (text) => {

	if (!(typeof text === 'string' && text.trim())) {
		return BLANK_OUTPUT;
	}

	const CLASS = 'em';
	const STRONG_CLASS = 'strong';
	const STRONG_EM = [STRONG_CLASS, CLASS].join('--');

	const $ = cheerio.load(`
		<em class="${CLASS}">${text}</em>
	`);

	const $em = $('em').first();

	$em.find('strong').each((i, elem) => {
		$em.is(elem.parent) && $(elem).addClass(STRONG_EM);
	});

	$em.find('*').each((i, elem) => {
		const $elem = $(elem);
		!$elem.hasClass(STRONG_EM) && $elem.replaceWith($elem.text());
	});

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');
};

module.exports = render;
