'use strict';
const {createChild} = require('./child-operations');
const applyStyles = require('./styles');
const spawnEntities = require('./entities');
const assert = require('assert');

describe('Styles', function () {
    describe('Apply Styles', function () {
        const defaultType = 'unstyled';
        const boldType = 'BOLD';
        const linkType = 'LINK';
        const fullRange = {
            offset: 0,
            length: 14
        };
        const textNode = {
            range: fullRange,
            text: 'some test text'
        };
        const middleRange = {
            offset: 5,
            length: 4
        };
        const rightRange = {
            offset: 9,
            length: 5
        };
        const textNodeRight = {
            range: rightRange,
            text: ' text'
        };
        const textNodeMiddle = {
            range: middleRange,
            text: 'test'
        };
        const entityRanges = [
            Object.assign({}, middleRange, {
                style: linkType,
                key: 0
            })
        ];
        const entityMap = [{
            type: linkType,
            mutability: 'MUTABLE',
            data: {
                url: '#'
            }
        }, {
            type: linkType,
            mutability: 'MUTABLE',
            data: {
                url: '#'
            }
        }];

        it('should apply a style in the beginning of a node ending in the same node', function () {
            const styleRange = {
                offset: 0,
                length: 3
            };
            const styleRanges = [{
                style: boldType,
                offset: 0,
                length: 3
            }];
            const styledTextNode = {
                range: styleRange,
                text: 'som'
            };
            const leftSubnode = {
                range: {
                    offset: 3,
                    length: 2
                },
                text: 'e '
            };
            const child = createChild(textNode, defaultType, fullRange);
            const treeWithEntities = spawnEntities(child, entityRanges, entityMap);
            const result = applyStyles(treeWithEntities, styleRanges)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children, [
                createChild(styledTextNode, boldType, styleRange),
                leftSubnode,
                createChild(textNodeMiddle, linkType, middleRange, entityMap[0].data),
                textNodeRight
            ]);
        });

        it('should apply a style in the end of a node ending in the same node', function () {
            const styleRange = {
                offset: 2,
                length: 3
            };
            const styleRanges = [{
                style: boldType,
                offset: 2,
                length: 3
            }];
            const styledTextNode = {
                range: styleRange,
                text: 'me '
            };
            const leftSubnode = {
                range: {
                    offset: 0,
                    length: 2
                },
                text: 'so'
            };
            const child = createChild(textNode, defaultType, fullRange);
            const treeWithEntities = spawnEntities(child, entityRanges, entityMap);
            const result = applyStyles(treeWithEntities, styleRanges)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children, [
                leftSubnode,
                createChild(styledTextNode, boldType, styleRange),
                createChild(textNodeMiddle, linkType, middleRange, entityMap[0].data),
                textNodeRight
            ]);
        });

        it('should apply a style in the middle of a node ending in the same node', function () {
            const styleRange = {
                offset: 2,
                length: 2
            };
            const styleRanges = [{
                style: boldType,
                offset: 2,
                length: 2
            }];
            const styledTextNode = {
                range: styleRange,
                text: 'me'
            };
            const leftSubnode = {
                range: {
                    offset: 0,
                    length: 2
                },
                text: 'so'
            };
            const rightSubnode = {
                range: {
                    offset: 4,
                    length: 1
                },
                text: ' '
            };
            const child = createChild(textNode, defaultType, fullRange);
            const treeWithEntities = spawnEntities(child, entityRanges, entityMap);
            const result = applyStyles(treeWithEntities, styleRanges)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children, [
                leftSubnode,
                createChild(styledTextNode, boldType, styleRange),
                rightSubnode,
                createChild(textNodeMiddle, linkType, middleRange, entityMap[0].data),
                textNodeRight
            ]);
        });

        it('should apply a style in the middle of a node ending in a diffrent node', function () {
            const styleRange = {
                offset: 2,
                length: 3
            };
            const styleRanges = [{
                style: boldType,
                offset: 2,
                length: 5
            }];
            const styledTextNode = {
                range: styleRange,
                text: 'me '
            };
            const leftSubnode = {
                range: {
                    offset: 0,
                    length: 2
                },
                text: 'so'
            };
            const child = createChild(textNode, defaultType, fullRange);
            const treeWithEntities = spawnEntities(child, entityRanges, entityMap);
            const result = applyStyles(treeWithEntities, styleRanges)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});

            assert.deepEqual(result.children[0], leftSubnode);
            assert.deepEqual(result.children[1], createChild(styledTextNode, boldType, styleRange));

            assert.equal(result.children[2].component, linkType);
            assert.equal(result.children[2].children[0].component, boldType);
            assert.equal(result.children[2].children[0].range.length, 2);
            assert(!result.children[2].children[1].component);

            assert.deepEqual(result.children[3], textNodeRight);
        });

        it('should apply a style in the middle of a node ending in a diffrent node and wrapping a node', function () {
            const styleRange = {
                offset: 2,
                length: 3
            };
            const styleRangeRight = {
                offset: 9,
                length: 3
            };
            const styleRanges = [{
                style: boldType,
                offset: 2,
                length: 10
            }];
            const styledTextNode = {
                range: styleRange,
                text: 'me '
            };
            const styledTextNodeRight = {
                range: styleRangeRight,
                text: ' te'
            };
            const leftSubnode = {
                range: {
                    offset: 0,
                    length: 2
                },
                text: 'so'
            };
            const rightSubnode = {
                range: {
                    offset: 12,
                    length: 2
                },
                text: 'xt'
            };
            const child = createChild(textNode, defaultType, fullRange);
            const treeWithEntities = spawnEntities(child, entityRanges, entityMap);
            const result = applyStyles(treeWithEntities, styleRanges)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});

            assert.deepEqual(result.children[0], leftSubnode);

            assert.equal(result.children[1].component, boldType);
            assert.equal(result.children[1].children.length, 3);
            assert.deepEqual(result.children[1].children, [
                styledTextNode,
                createChild(textNodeMiddle, linkType, middleRange, entityMap[0].data),
                styledTextNodeRight]);

            assert.deepEqual(result.children[2], rightSubnode);
        });
    });
});
