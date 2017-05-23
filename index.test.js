const content = require('./example/example.json');
const getContentTree = require('./index');
const assert = require('assert');

function rangeCheck(tree) {
    if (!tree.children)
        return true;
    const childrenLength = tree.children.reduce((acc, child) => {
        return acc += child.range.length;
    }, 0);

    return tree.children.reduce((acc, child) => {
        if (tree.component !== 'root') {
            return acc && childrenLength === tree.range.length && rangeCheck(child);
        }
        return acc && rangeCheck(child);
    }, true);
}

describe('Content Tree', ()=>{
    it("should have consistent ranges", () => {
        const resultTree = getContentTree(content);
        assert(rangeCheck(resultTree));
    });
});
