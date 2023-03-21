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
      let imageMatch;
      if (node.url){
        imageMatch = node.url.match('/api/images/(.*)/(.*)');
      }else if (node.attributes.src){
        imageMatch = node.attributes.src.match('/api/images/(.*)/(.*)');
        console.log(imageMatch);
      }
      if (!imageMatch) {
          return;
      }
      const scope = imageMatch[1];
      const fileName = imageMatch[2];
      const nodeId = createNodeId(`RemoteImage-${scope}-${fileName}`);
      const fileNode = await createRemoteFileNode({
          url: `${pluginOptions.url}${imageMatch[0]}`,
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
        if (node.url){
          node.url = readyPath;
        }else if (node.attributes.src) {
          node.attributes.src = readyPath;
          node.data.hProperties.src = readyPath;
        }
      }
    const { createNode } = actions
    const imageNodes = [];
    visit(markdownAST, (node) => {
        if (node.type !== 'image' && node.type !== 'leafDirective' && node.name !== 'img') {
            return;
        }
        imageNodes.push(node);
    })
    const promises = imageNodes.map((node) => {
      return processImages(node);
    });
    await Promise.all(promises);
}