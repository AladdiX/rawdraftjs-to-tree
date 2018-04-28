'use strict';
const {createChild, splitChild} = require('./child-operations');
const assert = require('assert');

describe('Child operations', function () {
    const fullRange = {
        offset: 0,
        length: 14
    };
    const leftRange = {
        offset: 0,
        length: 2
    };
    const rightRange = {
        offset: 2,
        length: 12
    };
    const textNode = {
        range: fullRange,
        text: 'some test text'
    };
    const textNodeLeft = {
        range: leftRange,
        text: 'so'
    };
    const textNodeRight = {
        range: rightRange,
        text: 'me test text'
    };
    const boldType = 'BOLD';
    const linkType = 'LINK';
    const data = {
        url: '/silly/url'
    };

    describe('Create child', function () {
        it('should create a child with no text', function () {
            const result = createChild(null, boldType, leftRange);

            assert.equal(result.component, boldType);
            assert.deepEqual(result.range, leftRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children, []);
        });
        it('should create a child with text', function () {
            const result = createChild(textNodeLeft, boldType, leftRange);

            assert.equal(result.component, boldType);
            assert.deepEqual(result.range, leftRange);
            assert.deepEqual(result.data, {});
            assert.deepEqual(result.children, [textNodeLeft]);
        });
        it('should create a child with data', function () {
            const result = createChild(textNodeRight, linkType, rightRange, data);

            assert.equal(result.component, linkType);
            assert.deepEqual(result.range, rightRange);
            assert.deepEqual(result.data, data);
            assert.deepEqual(result.children, [textNodeRight]);
        });
    });

    describe('Split Child', function () {
        it('should wrap a child', function () {
            const expected1 = createChild(textNode, boldType, fullRange);
            const result = splitChild(textNode, fullRange, boldType);

            assert.deepEqual(result.length, 1);
            assert.deepEqual(result[0], expected1);
        });
        it('should split a child in two', function () {
            const expected1 = createChild(textNodeLeft, boldType, leftRange);
            const result = splitChild(textNode, leftRange, boldType);

            assert.deepEqual(result.length, 2);
            assert.deepEqual(result[0], expected1);
            assert.deepEqual(result[1], textNodeRight);
        });

        it('should split a child in three', function () {
            const middleRange = {
                offset: 2,
                length: 2
            };
            const middleTextNode = {
                range: middleRange,
                text: 'me'
            };
            const expectedRight = {
                range: {
                    offset: 4,
                    length: 10
                },
                text: ' test text'
            };
            const expected = createChild(middleTextNode, boldType, middleRange);
            const result = splitChild(textNode, middleRange, boldType);

            assert.equal(result.length, 3);
            assert.deepEqual(result[0], textNodeLeft);
            assert.deepEqual(result[1], expected);
            assert.deepEqual(result[2], expectedRight);
        });
    });

    describe('Replace Child', function () {
        it('should wrap a child', function () {
            const expected1 = createChild(textNode, boldType, fullRange);
            const result = splitChild(textNode, fullRange, boldType);

            assert.deepEqual(result.length, 1);
            assert.deepEqual(result[0], expected1);
        });
    });
});
