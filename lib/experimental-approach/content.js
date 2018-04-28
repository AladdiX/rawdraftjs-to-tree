export default class Content {
    constructor(data) {
        this.key = data.key;
        this.data = data.data;
        this.text = data.text;
        this.type = data.type;
        this.depth = data.depth;
        this.entityRanges = data.entityRanges;
        this.inlineStyleRanges = data.inlineStyleRanges;
        this.length = data.text.length;
    }

    pop() {
        const res = {};
        if (this.isAtomicEntity()){
            res['entity'] = this.entityRanges.pop();
        }
        
        if (this.isAtomicStyle()){
            res['style'] = this.inlineStyleRanges.pop();
        }
    }

    split() {
        if(this.hasEntities() && !this.isAtomicEntity()) {
            return this.splitByEntities();
        }

        if(this.hasStyles() && !this.isAtomicStyle()) {
            return this.splitByStyles();
        }
    
        //nothing to split
        return [this];
    }

    hasEntities() {
        return this.entityRanges.length !== 0;
    }

    hasStyles() {
        return this.inlineStyleRanges.length !== 0;
    }

    isAtomicEntity() {
        return this.entityRanges.length === 1 && this.text.length === this.entityRanges[0].length;
    }

    isAtomicStyle() {
        return this.inlineStyleRanges.length === 1 && this.text.length === this.inlineStyleRanges[0].length;
    }

    isText() {
        return !this.hasEntities() && !this.hasStyles();
    }

    splitByEntities() {
        return entityRanges.map((entity, index) => {
            return new Content({
                key: `${this.key}-${index}`,
                text: this.text.substr(entity.offset, entity.length),
                type: this.type,
                data: this.data,
                depth: this.depth,
                inlineStyleRanges: this.extractStyles(entity),
                entityRanges: [{
                    offset: 0,
                    length: entity.length,
                    key: entity.key
                }]
            })
        });
    }

    extractStyles(entity) {
        return this.inlineStyleRanges.map((inlineStyleRange) => {
            const stylePosition = styleToEntityStatus(inlineStyleRange, entity);
            if (stylePosition.wrapped) {
                return {
                    offset: inlineStyleRange.offset - entity.offset,
                    length: inlineStyleRange.length,
                    style: inlineStyleRange.style
                }
            }
            if (stylePosition.wrapped) {
                return {
                    offset: inlineStyleRange.offset - entity.offset,
                    length: inlineStyleRange.length,
                    style: inlineStyleRange.style
                }
            }
            if (stylePosition.wrapped) {
                return {
                    offset: inlineStyleRange.offset - entity.offset,
                    length: inlineStyleRange.length,
                    style: inlineStyleRange.style
                }
            }
            if (stylePosition.wrapped) {
                return {
                    offset: inlineStyleRange.offset - entity.offset,
                    length: inlineStyleRange.length,
                    style: inlineStyleRange.style
                }
            }
            return {
                offset: inlineStyleRange.offset - entity.offset,
                length: inlineStyleRange.length,
                style: inlineStyleRange.style
            }
        });
    }
}

function styleToEntityStatus(styleRange, entity) {
    const entityRightCoord = entity.offset + entity.length;
    const styleRangeRightCoord = styleRange.offset + styleRange.length;

    //Style wraps entity, equal entity range is considered wrapped
    const wrapped = styleRange.offset <= entity.offset
                && styleRangeRightCoord >= entityRightCoord;
    //Style is inside a entity, excludingrange equality for inside as it conflicts with wraping
    const inside = styleRange.offset >= entity.offset
                && styleRangeRightCoord <= entityRightCoord
                && styleRange.length !== entity.length;
    //Style starts in the middle of the entity, ends outside
    //this is a separate case as the generated entity range needs to be ajusted
    const middleStart = styleRange.offset > entity.offset
                && styleRange.offset < entityRightCoord
                && styleRangeRightCoord > entityRightCoord;
    //Style ends in the middle of the entity, starts outside
    //this is a separate case as the generated entity range needs to be ajusted with
    const middleEnd = styleRange.offset < entity.offset
                && entity.offset < styleRangeRightCoord
                && styleRangeRightCoord < entityRightCoord;
    //entity outside the style range do not require processing
    const rightTo = entity.offset >= styleRangeRightCoord;
    const leftTo = styleRange.offset >= entityRightCoord;

    return {
        inside,
        middleStart,
        wrapped,
        middleEnd,
        leftTo,
        rightTo
    };
}

// {
//     "key": "dc53e",
//     "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tortor justo, maximus eget ultricies vitae, elementum ut est. Nunc feugiat nunc magna, sed facilisis justo aliquet sollicitudin. Donec ultricies tincidunt sem, ac porttitor magna. Nunc sit amet augue ipsum. Mauris lobortis nulla lacus, in interdum mauris ultricies et. Morbi vene",
//     "type": "unstyled",
//     "depth": 0,
//     "inlineStyleRanges": [{
//         "offset": 0,
//         "length": 3,
//         "style": "BOLD"
//     }, {
//         "offset": 193,
//         "length": 10,
//         "style": "BOLD"
//     }],
//     "entityRanges": [{
//         "offset": 193,
//         "length": 10,
//         "key": 12
//     }],
//     "data": {}
// }
