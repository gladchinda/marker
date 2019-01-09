/**
 * @function renderText
 * @description Overrides the default rendering for text tokens.
 *
 * @param {string} text The text.
 * @returns {string} The rendered HTML.
 */
const renderText = (text) => {
	console.log(text);
	return `<span>${text}</span>`;
};

module.exports = renderText;
