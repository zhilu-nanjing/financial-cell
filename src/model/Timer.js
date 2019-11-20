export default class Timer {
    constructor() {
        this.timer = [];
    }

    push(t) {
        this.timer.push(t);
    }

    clear() {
        for(let i = 0; i < this.timer.length; i++) {
            let t = this.timer[i];
            clearTimeout(t);
            clearInterval(t);
        }
    }
}