'use strict';
const {createChild, splitChild} = require('./child-operations');

function applyStyles(treeWithEntities, styleRanges) {
    //TODO: dcheck if dropping sorting possible
    return styleRanges.sort((style1, style2) => style1.offset >= style2.offset).reduce((children, styleRange) => {
        children.forEach((child) => {
            if (child.children) {
                child.children = getChildrenWithStyle(child, styleRange);
            }
        });
        //TODO: Check case where there is no entities ?
        return children;
    }, treeWithEntities);
}

function splitChildWithStyle(child, styleRange) {
    const nodeType = styleRange.style;

    return splitChild(child, styleRange, nodeType);
}

/* eslint-disable max-statements */
function getChildrenWithStyle(parent, styleRange) {
    let newChildren = [];
    let oldChildren = parent.children;
    let newChild;
    let leftSiblings = [];
    let styledChildren = [];
    let rightSiblings = [];

    while (oldChildren.length !== 0) {
        let currentChild = oldChildren.shift();
        let processedChild;
        let processingRange;
        const childStatus = styleToNodeStatus(styleRange, currentChild.range);
        const childRightCoord = currentChild.range.offset + currentChild.range.length;
        const styleRangeRightCoord = styleRange.offset + styleRange.length;

        if (childStatus.leftTo) {
            leftSiblings.push(currentChild);
            continue;
        }

        if (childStatus.rightTo) {
            rightSiblings.push(currentChild);
            continue;
        }

        //style inside child
        if (currentChild.hasOwnProperty('text')) {
            if (childStatus.inside) {
                processingRange = Object.assign({}, styleRange);

                /*style inside child spans over multiple children*/
            } else if (childStatus.middleStart) {
            //Style Starting in the middle of a child
                processingRange = {
                    offset: styleRange.offset,
                    length: childRightCoord - styleRange.offset,
                    style: styleRange.style
                };
            } else if (childStatus.middleEnd) {
            //Style ends in the middle of a child
                processingRange = {
                    offset: currentChild.range.offset,
                    length: styleRangeRightCoord - currentChild.range.offset,
                    style: styleRange.style
                };
            } else if (childStatus.wrapped) {
            //Style wraps child
                styledChildren.push(currentChild);
                continue;
            }

            processedChild = processChild(currentChild, processingRange);
            if (processedChild.leftSiblings) {
                leftSiblings.push(processedChild.leftSiblings);
            }
            if (processedChild.styledChildren) {
                styledChildren.push(...processedChild.styledChildren);
            }
            if (processedChild.rightSiblings) {
                rightSiblings.unshift(processedChild.rightSiblings);
            }
            continue;
        } else if (currentChild.children) {
            if (childStatus.wrapped) {
                styledChildren.push(currentChild);
            } else {
                currentChild.children = getChildrenWithStyle(currentChild, styleRange);
                if (childStatus.middleStart) {
                    leftSiblings.push(currentChild);
                } else {
                    rightSiblings.push(currentChild);
                }
            }
        }
    }

    newChildren.push(...leftSiblings);

    if (styledChildren.length > 0) {
        newChild = createChild(null, styleRange.style, getNodeRange(styledChildren));
        newChild.children.push(...styledChildren);
        newChildren.push(newChild);
    }
    newChildren.push(...rightSiblings);

    return newChildren;
}

/* eslint-enable max-statements */

function getNodeRange(styledChildren) {
    return {
        offset: styledChildren[0].range.offset,
        length: styledChildren.reduce((acc, child) => acc + child.range.length, 0)
    };
}
/**
 * Determine style relative position to child node position using the style range and node range
 * @param {Object} styleRange - Style range.
 * @param {Object} nodeRange - Child node range.
 *
 * @return {Object} with the following Child position indicators (See individual explanations in function comments)
 *     {Boolean} inside
 *     {Boolean} middleStart
 *     {Boolean} wrapped
 *     {Boolean} middleEnd
 *     {Boolean} leftTo
 *     {Boolean} rightTo
 */
function styleToNodeStatus(styleRange, nodeRange) {
    const childRightCoord = nodeRange.offset + nodeRange.length;
    const styleRangeRightCoord = styleRange.offset + styleRange.length;

    //Style wraps child, equal child range is considered wrapped
    const wrapped = styleRange.offset <= nodeRange.offset
                && styleRangeRightCoord >= childRightCoord;
    //Style is inside a child, excludingrange equality for inside as it conflicts with wraping
    const inside = styleRange.offset >= nodeRange.offset
                && styleRangeRightCoord <= childRightCoord
                && styleRange.length !== nodeRange.length;
    //Style starts in the middle of the child, ends outside
    //this is a separate case as the generated child range needs to be ajusted
    const middleStart = styleRange.offset > nodeRange.offset
                && styleRange.offset < childRightCoord
                && styleRangeRightCoord > childRightCoord;
    //Style ends in the middle of the child, starts outside
    //this is a separate case as the generated child range needs to be ajusted with
    const middleEnd = styleRange.offset < nodeRange.offset
                && nodeRange.offset < styleRangeRightCoord
                && styleRangeRightCoord < childRightCoord;
    //Children outside the style range do not require processing
    const rightTo = nodeRange.offset >= styleRangeRightCoord;
    const leftTo = styleRange.offset >= childRightCoord;

    return {
        inside,
        middleStart,
        wrapped,
        middleEnd,
        leftTo,
        rightTo
    };
}

/**
 * Processes a child node using a style range
 * @param {Object} childNode - Child node to process .
 * @param {Object} styleRange - The style range to apply to the child.
 *
 * @return {Object} with the following keys
 *     {Array} leftSiblings - unstyled left result nodes
 *     {Array} styledChildren - styled result nodes
 *     {Array} rightSiblings -  unstyled right result nodes
 */
function processChild(childNode, styleRange) {
    const processedChild = splitChildWithStyle(childNode, styleRange);

    if (processedChild.length === 3) {
        return {
            leftSiblings: processedChild[0],
            styledChildren: processedChild[1].children,
            rightSiblings: processedChild[2]
        };
    }
    if (processedChild.length === 2) {
        if (processedChild[0].children) {
            return {
                styledChildren: processedChild[0].children,
                rightSiblings: processedChild[1]
            };
        }

        return {
            leftSiblings: processedChild[0],
            styledChildren: processedChild[1].children
        };
    }

    return {
        styledChildren: processedChild[0].children
    };
}

module.exports = applyStyles;
