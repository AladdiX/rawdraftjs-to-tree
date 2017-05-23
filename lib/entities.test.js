'use strict';
const {createChild} = require('./child-operations');
const spawnEntities = require('./entities');
const assert = require('assert');

describe('Entities', function () {
    describe('Spawn Entities', function () {
        const defaultType = 'unstyled';
        const linkType = 'LINK';
        const fullRange = {
            offset: 0,
            length: 14
        };
        const textNode = {
            range: fullRange,
            text: 'some test text'
        };
        const leftRange = {
            offset: 0,
            length: 5
        };
        const middleRange = {
            offset: 5,
            length: 4
        };
        const rightRange = {
            offset: 9,
            length: 5
        };
        const textNodeLeft = {
            range: leftRange,
            text: 'some '
        };
        const textNodeRight = {
            range: rightRange,
            text: ' text'
        };
        const textNodeMiddle = {
            range: middleRange,
            text: 'test'
        };
        const entityRanges = [Object.assign({}, middleRange, {
            style: linkType,
            key: 0
        })];
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

        it('should spawn a link with two text siblings', function () {
            const child = createChild(textNode, defaultType, fullRange);
            const result = spawnEntities(child, entityRanges, entityMap)[0];

            assert.equal(result.component, defaultType);
            assert.deepEqual(result.range, fullRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children,
                [
                    textNodeLeft,
                    createChild(textNodeMiddle, linkType, middleRange, entityMap[0].data),
                    textNodeRight
                ]);
        });
    });
});
