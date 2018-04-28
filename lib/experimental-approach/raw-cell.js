import Content from './content';

export default class RawCell {
    constructor(content, entityMap) {
        let contentInstance = content;
        if (!contentInstance instanceof Content) {
            contentInstance = new Content(content);
        }
        this.content = contentInstance;

        if (!this.content.isText()) {
            this.mutate(content, entityMap);
        }

        if (!this.content.isText()) {
            this.mutate(content, entityMap);
        }

        if (!this.content.isText()) {
            this.mutate(content, entityMap);
        }
    }

    mutate() {
        const partitions = this.content.split();
        this.children = partitions.map((partition)=>{

            return new RawCell(partition.content, partition.entityMap);
        } 
    );
    }
}