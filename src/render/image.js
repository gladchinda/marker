const cheerio = require('cheerio');
const classnames = require('classnames');
const { isURL, escape, unescape } = require('validator');
const BLANK_OUTPUT = String();

/**
 * @function render
 * @description Overrides the default rendering for image tokens.
 *
 * @param {string} src The image src URL.
 * @param {string} title The image title text.
 * @param {string} text The image alt text.
 *
 * @returns {string} The rendered HTML.
 */
const render = (src, title, text) => {

	if (!(text && src && isURL(src))) {
		return BLANK_OUTPUT;
	}

	// Image Alt Text can contain optional image flags.
	// Flags are case-insensitive and should be separated by a pipe (|).
	// Possible flags are: BLOCK | HALF | RIGHT | SQUARE
	// Here is the Alt Text format:
	// [[...flags] alt_text]
	const IMG_FLAGS = ['BLOCK', 'BORDER', 'HALF', 'RIGHT', 'SQUARE'];
	const ALT_REGEX = /^(?:\{([^{}]+?)\})?\s*(.+?)$/;
	let [ , flags, alt ] = text.match(ALT_REGEX);

	alt = alt.trim();

	flags = `${flags}`.split('|')
		.map(flag => flag.trim().toUpperCase())
		.filter(flag => IMG_FLAGS.includes(flag));

	const { block, border, half, right, square } = IMG_FLAGS.reduce((__flags, flag) => {
		return { ...__flags, [ flag.toLowerCase() ]: flags.includes(flag) };
	}, {});

	const CLASS = 'image';
	const tag = block ? 'figure' : 'span';

	const imageClass = classnames([
		CLASS,
		block && [
			[ CLASS, 'block' ].join('--'),
			half && [
				[ CLASS, 'half' ].join('--'),
				[ CLASS, right ? 'right' : 'left' ].join('--')
			],
			{
				[[ CLASS, 'square' ].join('--')]: square,
				[[ CLASS, 'border' ].join('--')]: border
			}
		]
	]);

	const imgClass = [ CLASS, 'img' ].join('__');
	const captionClass = [ CLASS, 'caption' ].join('__');

	const $ = cheerio.load(`
		<${tag} class="${imageClass}">
			<img src="${src}" alt="${alt}" class="${imgClass}">
		</${tag}>
	`);

	if (typeof title === 'string' && title.trim()) {
		const $img = $('img').first();
		const __title__ = $(`<span>${ unescape(title.trim()) }</span>`);

		let __hasHTML__ = false;

		__title__.find('*').each((i, elem) => {
			const $elem = $(elem);
			const __directChild__ = __title__.is(elem.parent);
			const __class__ = `caption-${elem.name} ${captionClass}-${elem.name}`;

			let __allowedChild__ = false;

			switch (elem.name) {
				case 'a': {
					const href = $elem.attr('href');
					const text = $elem.text() || href;

					__allowedChild__ = text && href && isURL(href);

					$elem.attr('target', '_blank');
					$elem.attr('rel', 'nofollow noopener noreferrer');

					break;
				}
				case 'code': {
					const code = escape($elem.html().trim());
					const __code__ = code.split(/[\r\n]/, 1)[0];

					__allowedChild__ = !!__code__;
					$elem.html(__code__);

					break;
				}
				default: {
					__allowedChild__ = false;
					break;
				}
			}

			if (!__hasHTML__) {
				__hasHTML__ = __allowedChild__;
			}

			(__directChild__ && __allowedChild__)
				? $elem.addClass(__class__)
				: $elem.replaceWith($elem.text());
		});

		const __text__ = __title__.text();

		$img.attr('title', __hasHTML__ ? unescape(__text__) : __text__);

		if (block) {
			const __caption__ = $(`<figcaption class="${captionClass}"></figcaption>`);

			__caption__.append(__title__.html());
			__caption__.insertAfter($img);
		}
	}

	return $.html(`.${CLASS}`).trim().replace(/[\r\n\t]/g, '');
};

module.exports = render;
