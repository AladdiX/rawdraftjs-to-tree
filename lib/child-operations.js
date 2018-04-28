'use strict';

function createChild(textNode, type, range, data = {}) {
    const cleanRange = {
        offset: range.offset,
        length: range.length
    };
    let children = [];

    if (textNode) {
        children.push(textNode);
    }

    return {
        component: getComponent(type),
        range: cleanRange,
        data,
        children
    };
}

function getComponent(type) {
    return type;
}

function createTextSubNode(navigationRange, slicingRange, text) {
    const cleanRange = {
        offset: navigationRange.offset,
        length: navigationRange.length
    };

    return {
        range: cleanRange,
        text: text.substr(slicingRange.offset, slicingRange.length)
    };
}

//!!MUTATION!!
function replaceChild(parent, index, children) {
    Array.prototype.splice.apply(parent, [index, 1].concat(children));
}

//child is a textNode
//Range vs substringing values differ, the former needs to be kept for navigating the result spilt children.
function splitChild(child, range, type, data) {
    let resultChildren = [];
    const rangeToChildOffset = range.offset - child.range.offset;
    const rightRangeCoord = range.offset + range.length;
    const rightChildCoord = child.range.offset + child.range.length;
    const textNode = createTextSubNode(range, {
        offset: rangeToChildOffset,
        length: range.length
    }, child.text);

    if (rangeToChildOffset > 0) {
        resultChildren.push(
            createTextSubNode({
                offset: child.range.offset,
                length: rangeToChildOffset
            }, {
                offset: 0,
                length: rangeToChildOffset
            }, child.text)
        );
    }

    resultChildren.push(createChild(textNode, type, range, data));

    if (rightRangeCoord < rightChildCoord) {
        resultChildren.push(
            createTextSubNode({
                offset: rightRangeCoord,
                length: rightChildCoord - rightRangeCoord
            }, {
                offset: rangeToChildOffset + range.length,
                length: rightChildCoord - rightRangeCoord
            }, child.text)
        );
    }

    return resultChildren;
}

module.exports = {
    createChild,
    replaceChild,
    splitChild
};
