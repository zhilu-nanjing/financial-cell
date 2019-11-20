export default class Moved {
    constructor() {
        this.range = null;
        this.state = 'move';
    }

    move(cellRange) {
        this.range = cellRange;
        this.state = 'move';

        return this;
    }
}