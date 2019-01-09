const { Renderer } = require('marked');
const renderer = new Renderer();

// renderer.blockquote = require('./blockquote');
// renderer.br = require('./br');
// renderer.code = require('./code');
// renderer.codespan = require('./codespan');
// renderer.del = require('./del');
renderer.em = require('./em');
renderer.heading = require('./heading');
renderer.hr = require('./hr');
// renderer.html = require('./html');
renderer.image = require('./image');
renderer.link = require('./link');
// renderer.list = require('./list');
// renderer.listitem = require('./listitem');
// renderer.paragraph = require('./paragraph');
renderer.strong = require('./strong');
// renderer.text = require('./text');

module.exports = renderer;
