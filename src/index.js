const fs = require('fs');
const path = require('path');
const marked = require('marked');
const cheerio = require('cheerio');
const renderer = require('./render');
const hljs = require('highlight.js');
// const prism = require('prismjs');
// const loadLanguages = require('prismjs/components/');

const HTML_PATH = path.resolve(__dirname, '../html/');
const MARKDOWN_PATH = path.resolve(__dirname, '../markdown/');

const __css__ = fs.readFileSync(
	path.resolve(__dirname, '../css/default.css')
).toString().trim();

const __highlight__ = (code, lang) => {
	return hljs.highlightAuto(code).value;
	// const __lang__ = lang.toLowerCase();
	// !(__lang__ in prism.languages) && loadLanguages([__lang__]);

	// return prism.highlight(code, prism.languages[__lang__], __lang__);
}

const __filterTokens__ = tokens => {
	const IGNORE_TOKENS = ['html', 'newline', 'space'];
	const __tokens__ = tokens.filter(({ type }) => !IGNORE_TOKENS.includes(type));

	__tokens__.links = tokens.links;
	return __tokens__;
};

marked.setOptions({
	renderer,
	highlight: __highlight__
});

const __transform__ = filename => {

	const __filepath__ = path.join(MARKDOWN_PATH, filename);
	const __filename__ = path.basename(filename, path.extname(filename));

	const __markdown__ = fs.readFileSync(__filepath__).toString();
	const __tokens__ = marked.lexer(__markdown__);

	// const __html__ = marked(markdown, { renderer });
	const html = marked.parser(__filterTokens__(__tokens__));

	// const $ = cheerio.load(html);
	const $ = cheerio.load(cheerio.load(html).html());

	const head = $('head').html(`
		<meta charset="utf-8">
		<style type="text/css">${__css__}</style>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github-gist.min.css" integrity="sha256-tAflq+ymku3Khs+I/WcAneIlafYgDiOQ9stIHH985Wo=" crossorigin="anonymous" />
		<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js" integrity="sha256-iq71rXEe/fvjCUP9AfLY0cKudQuKAQywiUpXkRFSkLc=" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.css">
		<script src="https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.js"></script>
	`);

	$('code').each((i, elem) => {
		if (elem.parentNode.name !== 'pre') {
			$(elem).addClass('code--inline');
		}
	})

	const __html__ = $.html().trim();//.replace(/[\r\n\t]/g, '');

	fs.writeFileSync(
		path.join(HTML_PATH, `${__filename__}.html`),
		Buffer.from(__html__)
	);

};

fs.readdirSync(MARKDOWN_PATH).forEach(__transform__);
