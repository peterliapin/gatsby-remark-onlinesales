const esmRequire = require('./esmRequire')
const visit = esmRequire('unist-util-visit').visit;

module.exports.default = ({ markdownAST }, pluginOptions) => {
    visit(markdownAST, (node) => {
        if (node.type !== 'image') {
            return;
        }
        node.url = `${pluginOptions.url}${node.url}`;
    })
  }
    