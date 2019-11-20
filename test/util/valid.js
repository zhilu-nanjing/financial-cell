export default class Vaild {
    constructor(cb = () => {}) {
        this.cb = cb;
    }

    assert() {
        this.cb();
        console.log("...");
    }
}