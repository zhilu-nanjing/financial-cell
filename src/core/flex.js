export default class Flex {
    constructor() {
        this.ref = [];
        this.filters = [];
        this.sort = null;
    }

    active() {
        return this.ref !== null;
    }
}