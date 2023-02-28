const esmRequire = require('./esmRequire')
const visit = esmRequire('unist-util-visit').visit;
const fs = require('fs-extra');
const path = require('path');
const { createRemoteFileNode  } = require(`gatsby-source-filesystem`)

module.exports.default = async ({ 
    markdownAST,  
    actions,
    createContentDigest,
    createNodeId,
    getCache,
    cache, 
}, pluginOptions) => {
    const processImages = async(node) =>{
      const imageMatch = node.url.match('/api/images/(.*)/(.*)');
      if (!imageMatch) {
          return;
      }
      const scope = imageMatch[1];
      const fileName = imageMatch[2];
      const nodeId = createNodeId(`RemoteImage-${scope}-${fileName}`);
      const fileNode = await createRemoteFileNode({
          url: `${pluginOptions.url}${node.url}`,
          parentNodeId: nodeId,
          getCache,
          createNode,
          createNodeId,
          cache,
        });
        const outputPath = path.join(process.cwd(), 'public', 'static', scope);
        const filePath = path.join(outputPath, fileName);
        fs.ensureDirSync(outputPath);
        fs.copy(fileNode.absolutePath, filePath, (err) => {
          if (err) {
            console.error(
              `error copying file from ${fileNode.absolutePath} to ${filePath}`,
              err,
            );
          }
        });
        const readyPath = `/static/${scope}/${fileName}`;
        console.log(`Created ${fileName} file at ${readyPath}`);
        node.url = readyPath;
      }
    const { createNode } = actions
    const imageNodes = [];
    visit(markdownAST, (node) => {
        if (node.type !== 'image') {
            return;
        }
        imageNodes.push(node);
    })
    const promises = imageNodes.map((node) => {
      return processImages(node);
    });
    await Promise.all(promises);
}