'use strict';
const spawnEntities = require('./lib/entities');
const applyStyles = require('./lib/styles');
const {createChild} = require('./lib/child-operations');

function getContentTree(content) {
    const blockTrees = content.blocks.map((item) => getBlockTree(item, content.entityMap));

    return {
        component: 'root',
        children: [].concat(...blockTrees)
    };
}

function getBlockTree(block, entityMap) {
    const initialRange = {
        offset: 0,
        length: block.text.length
    };
    const textNode = {
        range: initialRange,
        text: block.text
    };
    const initialChild = createChild(textNode, block.type, initialRange);
    const treeWithEntities = spawnEntities(initialChild, block.entityRanges, entityMap);
    const treeWithStyles = applyStyles(treeWithEntities, block.inlineStyleRanges);

    return treeWithStyles;
}

module.exports = getContentTree;
