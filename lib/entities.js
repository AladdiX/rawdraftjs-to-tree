'use strict';
const {splitChild, replaceChild} = require('./child-operations');

//The final result of spawnEntities is an array with only one element
//this is due to the recursiveness of the function
//maybe there is a better idea on how to do this
function spawnEntities(initialChild, entityRanges, entityMap) {
    return entityRanges.reduce((children, entityRange) => {
        children.forEach((child, index) => {
            replaceChild(children, index, findAndEditTextNode(child, entityRange, entityMap));
        });

        return children;
    }, [initialChild]);
}

function findAndEditTextNode(child, entityRange, entityMap) {
    let childRightCoord = child.range.offset + child.range.length;
    let entityRangeRightCoord = entityRange.offset + entityRange.length;

    if (child.range.offset <= entityRange.offset && childRightCoord >= entityRangeRightCoord) {
        if (child.hasOwnProperty('text')) {
            return splitChildWithEntity(child, entityRange, entityMap);
        }
        if (child.children) {
            child.children.forEach((deeperChild, index) => {
                replaceChild(child.children, index, findAndEditTextNode(deeperChild, entityRange, entityMap));
            });
        }
    }

    return child;
}

function splitChildWithEntity(child, entityRange, entityMap) {
    const entity = entityMap[entityRange.key];
    const entityType = entity.type;
    const entityData = entity.data;

    return splitChild(child, entityRange, entityType, entityData);
}

module.exports = spawnEntities;
